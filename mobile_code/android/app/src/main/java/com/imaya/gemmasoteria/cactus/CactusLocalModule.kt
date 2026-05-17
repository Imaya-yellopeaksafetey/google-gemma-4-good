package com.imaya.gemmasoteria.cactus

import android.os.StatFs
import android.util.Log
import com.cactus.cactusComplete
import com.cactus.cactusDestroy
import com.cactus.cactusGetLastError
import com.cactus.cactusInit
import com.cactus.cactusSetAppId
import com.cactus.cactusSetTelemetryEnvironment
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream
import java.io.BufferedInputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean
import java.util.zip.GZIPInputStream

class CactusLocalModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val TAG = "CactusLocalModule"
        private const val EVENT_OFFLINE_BACKUP_STATUS = "offlineBackupStatus"
        private const val OFFLINE_BACKUP_ARCHIVE_NAME = "gemma-4-e2b-it-pack.tar.gz"
        private const val OFFLINE_BACKUP_FOLDER_NAME = "gemma-4-e2b-it"
        private const val ESTIMATED_UNPACKED_BYTES = 6_300_000_000L
        private const val SAFETY_BUFFER_BYTES = 64L * 1024L * 1024L
    }

    private enum class OfflineBackupState {
        NOT_READY,
        DOWNLOAD_AVAILABLE,
        DOWNLOADING,
        VERIFYING,
        INSTALLING,
        READY,
        FAILED,
        INSUFFICIENT_STORAGE;

        fun wireValue(): String = name.lowercase(Locale.US)
    }

    private var handle: Long = 0L
    private var activeModelPath: String? = null
    private var lastPrepError: String? = null

    private val installExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private val installRunning = AtomicBoolean(false)

    @Volatile
    private var offlineBackupState: OfflineBackupState = OfflineBackupState.NOT_READY

    @Volatile
    private var offlineBackupProgressPercent: Int = 0

    @Volatile
    private var offlineBackupDownloadedBytes: Long = 0L

    @Volatile
    private var offlineBackupTotalBytes: Long = 0L

    @Volatile
    private var offlineBackupLastError: String? = null

    override fun getName(): String = "CactusLocalModule"

    private fun filesDirModelPath(): String =
        File(reactContext.filesDir, "cactus/$OFFLINE_BACKUP_FOLDER_NAME").absolutePath

    private fun noBackupModelPath(): String =
        File(reactContext.noBackupFilesDir, "cactus/$OFFLINE_BACKUP_FOLDER_NAME").absolutePath

    private fun externalModelPath(): String {
        val base = reactContext.getExternalFilesDir(null) ?: reactContext.filesDir
        return File(base, "cactus/$OFFLINE_BACKUP_FOLDER_NAME").absolutePath
    }

    private fun defaultModelPath(): String = noBackupModelPath()

    private fun archiveDownloadPath(): File {
        val base = File(reactContext.cacheDir, "offline-backup")
        if (!base.exists()) {
            base.mkdirs()
        }
        return File(base, OFFLINE_BACKUP_ARCHIVE_NAME)
    }

    private fun installBaseDir(): File = File(reactContext.noBackupFilesDir, "cactus")

    private fun emitOfflineBackupStatus() {
        if (!reactContext.hasActiveCatalystInstance()) {
            return
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_OFFLINE_BACKUP_STATUS, buildOfflineBackupStatus())
    }

    private fun setOfflineBackupStatus(
        state: OfflineBackupState,
        progressPercent: Int = offlineBackupProgressPercent,
        downloadedBytes: Long = offlineBackupDownloadedBytes,
        totalBytes: Long = offlineBackupTotalBytes,
        lastError: String? = offlineBackupLastError
    ) {
        offlineBackupState = state
        offlineBackupProgressPercent = progressPercent.coerceIn(0, 100)
        offlineBackupDownloadedBytes = downloadedBytes.coerceAtLeast(0L)
        offlineBackupTotalBytes = totalBytes.coerceAtLeast(0L)
        offlineBackupLastError = lastError
        emitOfflineBackupStatus()
    }

    private fun buildOfflineBackupStatus() = Arguments.createMap().apply {
        val runtime = currentRuntimeStatus()
        putString("state", offlineBackupState.wireValue())
        putInt("progressPercent", offlineBackupProgressPercent)
        putDouble("downloadedBytes", offlineBackupDownloadedBytes.toDouble())
        putDouble("totalBytes", offlineBackupTotalBytes.toDouble())
        putString("lastError", offlineBackupLastError)
        putBoolean("runtimeAvailable", runtime.available)
        putBoolean("runtimeInitialized", runtime.initialized)
        putString("modelPath", activeModelPath ?: defaultModelPath())
    }

    private fun updateOfflineBackupStatusFromRuntime() {
        if (installRunning.get()) {
            return
        }

        val runtime = currentRuntimeStatus()
        if (runtime.available) {
            setOfflineBackupStatus(
                state = OfflineBackupState.READY,
                progressPercent = 100,
                downloadedBytes = 0L,
                totalBytes = 0L,
                lastError = null
            )
        } else {
            val fallbackState =
                if (offlineBackupState == OfflineBackupState.FAILED || offlineBackupState == OfflineBackupState.INSUFFICIENT_STORAGE) {
                    offlineBackupState
                } else {
                    OfflineBackupState.DOWNLOAD_AVAILABLE
                }
            setOfflineBackupStatus(
                state = fallbackState,
                progressPercent = 0,
                downloadedBytes = 0L,
                totalBytes = 0L,
                lastError = offlineBackupLastError
            )
        }
    }

    private data class RuntimeStatus(
        val path: String,
        val modelExists: Boolean,
        val initialized: Boolean,
        val available: Boolean,
        val lastError: String?
    )

    private fun currentRuntimeStatus(): RuntimeStatus {
        val modelPath = activeModelPath ?: defaultModelPath()
        val modelDir = File(modelPath)
        val modelExists = modelDir.exists() && modelDir.isDirectory && File(modelDir, "config.txt").exists()
        val initialized = handle != 0L
        val nativeError = cactusGetLastError().ifEmpty { null }
        val lastError = lastPrepError ?: nativeError
        return RuntimeStatus(
            path = modelPath,
            modelExists = modelExists,
            initialized = initialized,
            available = modelExists,
            lastError = lastError
        )
    }

    private fun copyDirectory(source: File, target: File) {
        if (source.isDirectory) {
            if (!target.exists()) {
                target.mkdirs()
            }
            source.listFiles()?.forEach { child ->
                copyDirectory(child, File(target, child.name))
            }
            return
        }

        target.parentFile?.mkdirs()
        source.inputStream().use { input ->
            target.outputStream().use { output ->
                input.copyTo(output)
            }
        }
    }

    private fun deleteRecursively(path: File) {
        if (!path.exists()) {
            return
        }
        path.deleteRecursively()
    }

    private fun logPathState(label: String, path: String) {
        val file = File(path)
        Log.i(
            TAG,
            "$label path=$path exists=${file.exists()} isDir=${file.isDirectory} canRead=${file.canRead()} files=${file.list()?.size ?: -1}"
        )
    }

    private fun prepareModelInternal(): Boolean {
        val canonicalPath = defaultModelPath()
        val canonicalDir = File(canonicalPath)
        val candidatePaths = listOf(
            filesDirModelPath(),
            noBackupModelPath(),
            externalModelPath()
        ).distinct()

        Log.i(TAG, "prepareModelInternal starting")
        logPathState("filesDir", filesDirModelPath())
        logPathState("noBackupFilesDir", noBackupModelPath())
        logPathState("externalFilesDir", externalModelPath())

        if (canonicalDir.exists() && File(canonicalDir, "config.txt").exists()) {
            lastPrepError = null
            Log.i(TAG, "prepareModelInternal canonical model already present at $canonicalPath")
            return true
        }

        val source = candidatePaths
            .asSequence()
            .map(::File)
            .firstOrNull { it.exists() && it.isDirectory && it.canRead() && File(it, "config.txt").exists() && it.absolutePath != canonicalPath }

        if (source == null) {
            lastPrepError = "no_readable_model_source"
            Log.w(TAG, "prepareModelInternal found no readable source")
            return false
        }

        return try {
            canonicalDir.parentFile?.mkdirs()
            copyDirectory(source, canonicalDir)
            lastPrepError = null
            Log.i(TAG, "prepareModelInternal copied source=${source.absolutePath} -> target=$canonicalPath")
            true
        } catch (error: Exception) {
            lastPrepError = "prepare_copy_failed:${error.message}"
            Log.e(TAG, "prepareModelInternal copy failed", error)
            false
        }
    }

    private fun buildStatus() = Arguments.createMap().apply {
        val runtime = currentRuntimeStatus()
        Log.i(
            TAG,
            "buildStatus path=${runtime.path} exists=${runtime.modelExists} initialized=${runtime.initialized} lastError=${runtime.lastError}"
        )
        putBoolean("isSupported", true)
        putString("modelPath", runtime.path)
        putBoolean("modelExists", runtime.modelExists)
        putBoolean("initialized", runtime.initialized)
        putString("lastError", runtime.lastError)
    }

    private fun initializeIfNeeded(modelPath: String?): Boolean {
        val resolvedPath = modelPath?.takeIf { it.isNotBlank() } ?: defaultModelPath()
        val modelDir = File(resolvedPath)
        activeModelPath = resolvedPath
        Log.i(
            TAG,
            "initializeIfNeeded resolvedPath=$resolvedPath exists=${modelDir.exists()} isDir=${modelDir.isDirectory} files=${modelDir.list()?.size ?: -1} currentHandle=$handle"
        )

        if (!modelDir.exists() || !File(modelDir, "config.txt").exists()) {
            Log.w(TAG, "initializeIfNeeded model directory missing at $resolvedPath")
            return false
        }

        if (handle != 0L && activeModelPath == resolvedPath) {
            Log.i(TAG, "initializeIfNeeded using existing handle=$handle for path=$resolvedPath")
            return true
        }

        if (handle != 0L) {
            cactusDestroy(handle)
            handle = 0L
        }

        val telemetryDir = File(reactContext.cacheDir, "cactus-telemetry")
        telemetryDir.mkdirs()
        cactusSetTelemetryEnvironment(telemetryDir.absolutePath)
        cactusSetAppId(reactContext.packageName)

        handle = cactusInit(resolvedPath, null, false)
        activeModelPath = resolvedPath
        val initOk = handle != 0L
        Log.i(
            TAG,
            "initializeIfNeeded cactusInit handle=$handle ok=$initOk lastError=${cactusGetLastError()}"
        )
        return initOk
    }

    private fun parseTotalBytes(connection: HttpURLConnection, downloadedBefore: Long, expectedBytes: Long): Long {
        val contentRange = connection.getHeaderField("Content-Range")
        if (!contentRange.isNullOrBlank()) {
            val slashIndex = contentRange.indexOf('/')
            if (slashIndex >= 0) {
                val total = contentRange.substring(slashIndex + 1).trim().toLongOrNull()
                if (total != null && total > 0L) {
                    return total
                }
            }
        }

        val contentLength = connection.contentLengthLong
        if (contentLength > 0L) {
            return if (downloadedBefore > 0L && connection.responseCode == HttpURLConnection.HTTP_PARTIAL) {
                downloadedBefore + contentLength
            } else {
                contentLength
            }
        }

        return expectedBytes
    }

    private fun ensureEnoughStorage(expectedBytes: Long): Boolean {
        val archiveFile = archiveDownloadPath()
        val existingArchiveBytes = if (archiveFile.exists()) archiveFile.length() else 0L
        val requiredBytes = (expectedBytes - existingArchiveBytes).coerceAtLeast(0L) + ESTIMATED_UNPACKED_BYTES + SAFETY_BUFFER_BYTES
        val availableBytes = StatFs(reactContext.cacheDir.absolutePath).availableBytes
        Log.i(TAG, "ensureEnoughStorage available=$availableBytes required=$requiredBytes existingArchiveBytes=$existingArchiveBytes")

        return if (availableBytes < requiredBytes) {
            setOfflineBackupStatus(
                state = OfflineBackupState.INSUFFICIENT_STORAGE,
                progressPercent = 0,
                downloadedBytes = 0L,
                totalBytes = expectedBytes,
                lastError = "insufficient_storage"
            )
            false
        } else {
            true
        }
    }

    private fun downloadArchive(url: String, expectedBytes: Long): File {
        val archiveFile = archiveDownloadPath()
        val maxAttempts = 6

        repeat(maxAttempts) { attempt ->
            var downloadedBefore = if (archiveFile.exists()) archiveFile.length() else 0L

            if (expectedBytes > 0L && downloadedBefore == expectedBytes) {
                Log.i(TAG, "downloadArchive using fully cached archive bytes=$downloadedBefore")
                setOfflineBackupStatus(
                    state = OfflineBackupState.VERIFYING,
                    progressPercent = 100,
                    downloadedBytes = downloadedBefore,
                    totalBytes = expectedBytes,
                    lastError = null
                )
                return archiveFile
            }

            if (expectedBytes > 0L && downloadedBefore > expectedBytes) {
                Log.w(TAG, "downloadArchive deleting oversized cached archive bytes=$downloadedBefore expected=$expectedBytes")
                archiveFile.delete()
                downloadedBefore = 0L
            }

            var connection: HttpURLConnection? = null
            try {
                connection = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    setRequestProperty("Accept-Encoding", "identity")
                    connectTimeout = 15_000
                    readTimeout = 120_000
                    if (downloadedBefore > 0L) {
                        setRequestProperty("Range", "bytes=$downloadedBefore-")
                    }
                }

                connection.connect()
                val responseCode = connection.responseCode
                if (responseCode == 416 &&
                    expectedBytes > 0L &&
                    archiveFile.exists() &&
                    archiveFile.length() == expectedBytes
                ) {
                    Log.i(TAG, "downloadArchive received 416 but cached archive is complete; continuing with verify/install")
                    setOfflineBackupStatus(
                        state = OfflineBackupState.VERIFYING,
                        progressPercent = 100,
                        downloadedBytes = archiveFile.length(),
                        totalBytes = expectedBytes,
                        lastError = null
                    )
                    return archiveFile
                }

                val append = downloadedBefore > 0L && responseCode == HttpURLConnection.HTTP_PARTIAL

                if (!append && responseCode == HttpURLConnection.HTTP_OK && downloadedBefore > 0L) {
                    archiveFile.delete()
                    downloadedBefore = 0L
                }

                if (responseCode !in 200..299 && responseCode != HttpURLConnection.HTTP_PARTIAL) {
                    throw IllegalStateException("download_http_$responseCode")
                }

                val totalBytes = parseTotalBytes(connection, downloadedBefore, expectedBytes)
                setOfflineBackupStatus(
                    state = OfflineBackupState.DOWNLOADING,
                    progressPercent = if (totalBytes > 0L) (((downloadedBefore * 100L) / totalBytes).toInt()).coerceIn(0, 99) else 0,
                    downloadedBytes = downloadedBefore,
                    totalBytes = totalBytes,
                    lastError = null
                )

                BufferedInputStream(connection.inputStream).use { source ->
                    FileOutputStream(archiveFile, append).use { sink ->
                        val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                        var downloaded = downloadedBefore
                        var lastEmittedPercent = if (totalBytes > 0L) ((downloadedBefore * 100L) / totalBytes).toInt() else 0

                        while (true) {
                            val read = source.read(buffer)
                            if (read <= 0) {
                                break
                            }

                            sink.write(buffer, 0, read)
                            downloaded += read.toLong()

                            if (totalBytes > 0L) {
                                val nextPercent = ((downloaded * 100L) / totalBytes).toInt().coerceIn(0, 99)
                                if (nextPercent > lastEmittedPercent) {
                                    lastEmittedPercent = nextPercent
                                    setOfflineBackupStatus(
                                        state = OfflineBackupState.DOWNLOADING,
                                        progressPercent = nextPercent,
                                        downloadedBytes = downloaded,
                                        totalBytes = totalBytes,
                                        lastError = null
                                    )
                                }
                            }
                        }
                    }
                }

                val finalSize = archiveFile.length()
                if (expectedBytes > 0L && finalSize < expectedBytes) {
                    Log.w(TAG, "downloadArchive incomplete after attempt=${attempt + 1} bytes=$finalSize expected=$expectedBytes")
                    if (attempt == maxAttempts - 1) {
                        throw IllegalStateException("download_incomplete")
                    }
                    Thread.sleep(1_000L)
                    return@repeat
                }

                setOfflineBackupStatus(
                    state = OfflineBackupState.VERIFYING,
                    progressPercent = 100,
                    downloadedBytes = finalSize,
                    totalBytes = totalBytes,
                    lastError = null
                )
                return archiveFile
            } catch (error: Throwable) {
                val currentSize = if (archiveFile.exists()) archiveFile.length() else 0L
                Log.w(TAG, "downloadArchive attempt=${attempt + 1} failed bytes=$currentSize", error)
                if (attempt == maxAttempts - 1) {
                    throw error
                }
                Thread.sleep(1_000L)
            } finally {
                connection?.disconnect()
            }
        }

        throw IllegalStateException("download_failed_exhausted")
    }

    private fun sha256(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        FileInputStream(file).use { stream ->
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            while (true) {
                val read = stream.read(buffer)
                if (read <= 0) {
                    break
                }
                digest.update(buffer, 0, read)
            }
        }

        return digest.digest().joinToString("") { "%02x".format(it) }
    }

    private fun installArchive(archiveFile: File) {
        val installBase = installBaseDir()
        val tempDir = File(installBase, "${OFFLINE_BACKUP_FOLDER_NAME}-installing")
        val finalDir = File(installBase, OFFLINE_BACKUP_FOLDER_NAME)

        deleteRecursively(tempDir)
        tempDir.mkdirs()

        setOfflineBackupStatus(
            state = OfflineBackupState.INSTALLING,
            progressPercent = 100,
            downloadedBytes = archiveFile.length(),
            totalBytes = archiveFile.length(),
            lastError = null
        )

        FileInputStream(archiveFile).use { fileInput ->
            GZIPInputStream(BufferedInputStream(fileInput)).use { gzipInput ->
                TarArchiveInputStream(gzipInput).use { tarInput ->
                    while (true) {
                        val entry = tarInput.nextTarEntry ?: break
                        val relativePath = entry.name.substringAfter('/', "")
                        if (relativePath.isBlank()) {
                            continue
                        }

                        val output = File(tempDir, relativePath)
                        val canonicalTarget = output.canonicalPath
                        val canonicalRoot = tempDir.canonicalPath + File.separator
                        if (!canonicalTarget.startsWith(canonicalRoot)) {
                            throw IllegalStateException("unsafe_archive_path")
                        }

                        if (entry.isDirectory) {
                            output.mkdirs()
                            continue
                        }

                        output.parentFile?.mkdirs()
                        FileOutputStream(output).use { sink ->
                            tarInput.copyTo(sink)
                        }
                    }
                }
            }
        }

        val configFile = File(tempDir, "config.txt")
        if (!configFile.exists()) {
            throw IllegalStateException("installed_model_missing_config")
        }

        deleteRecursively(finalDir)
        if (!tempDir.renameTo(finalDir)) {
            copyDirectory(tempDir, finalDir)
            deleteRecursively(tempDir)
        }

        archiveFile.delete()
    }

    private fun runOfflineBackupInstall(url: String, expectedSha256: String, expectedBytes: Long) {
        try {
            if (!ensureEnoughStorage(expectedBytes)) {
                return
            }

            val archiveFile = downloadArchive(url, expectedBytes)
            val actualSha = sha256(archiveFile)
            if (!actualSha.equals(expectedSha256, ignoreCase = true)) {
                archiveFile.delete()
                throw IllegalStateException("sha256_mismatch")
            }

            installArchive(archiveFile)

            prepareModelInternal()
            val initialized = initializeIfNeeded(null)
            if (!initialized) {
                throw IllegalStateException("runtime_initialize_failed")
            }

            val runtime = currentRuntimeStatus()
            if (!runtime.available) {
                throw IllegalStateException("runtime_not_ready_after_install")
            }

            setOfflineBackupStatus(
                state = OfflineBackupState.READY,
                progressPercent = 100,
                downloadedBytes = 0L,
                totalBytes = 0L,
                lastError = null
            )
        } catch (error: Throwable) {
            Log.e(TAG, "runOfflineBackupInstall failed", error)
            val message = error.message ?: error.javaClass.simpleName ?: "offline_backup_failed"
            setOfflineBackupStatus(
                state = if (message == "insufficient_storage") OfflineBackupState.INSUFFICIENT_STORAGE else OfflineBackupState.FAILED,
                progressPercent = 0,
                downloadedBytes = 0L,
                totalBytes = offlineBackupTotalBytes,
                lastError = message
            )
        } finally {
            installRunning.set(false)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        Log.d(TAG, "addListener event=$eventName")
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        Log.d(TAG, "removeListeners count=$count")
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        Log.i(TAG, "getStatus called")
        updateOfflineBackupStatusFromRuntime()
        promise.resolve(buildStatus())
    }

    @ReactMethod
    fun getOfflineBackupStatus(promise: Promise) {
        Log.i(TAG, "getOfflineBackupStatus called")
        updateOfflineBackupStatusFromRuntime()
        promise.resolve(buildOfflineBackupStatus())
    }

    @ReactMethod
    fun prepareModel(promise: Promise) {
        try {
            val prepared = prepareModelInternal()
            Log.i(TAG, "prepareModel called result=$prepared")
            updateOfflineBackupStatusFromRuntime()
            promise.resolve(buildStatus())
        } catch (error: Exception) {
            Log.e(TAG, "prepareModel failed", error)
            promise.reject("cactus_prepare_failed", error.message, error)
        }
    }

    @ReactMethod
    fun initialize(modelPath: String?, promise: Promise) {
        try {
            val ok = initializeIfNeeded(modelPath)
            Log.i(TAG, "initialize called result=$ok")
            updateOfflineBackupStatusFromRuntime()
            promise.resolve(buildStatus())
        } catch (error: Exception) {
            Log.e(TAG, "initialize failed", error)
            promise.reject("cactus_init_failed", error.message, error)
        }
    }

    @ReactMethod
    fun startOfflineBackupInstall(url: String, sha256: String, expectedBytes: Double, promise: Promise) {
        try {
            if (installRunning.get()) {
                promise.resolve(buildOfflineBackupStatus())
                return
            }

            val runtime = currentRuntimeStatus()
            if (runtime.available) {
                setOfflineBackupStatus(
                    state = OfflineBackupState.READY,
                    progressPercent = 100,
                    downloadedBytes = 0L,
                    totalBytes = 0L,
                    lastError = null
                )
                promise.resolve(buildOfflineBackupStatus())
                return
            }

            installRunning.set(true)
            setOfflineBackupStatus(
                state = OfflineBackupState.DOWNLOADING,
                progressPercent = 0,
                downloadedBytes = 0L,
                totalBytes = expectedBytes.toLong(),
                lastError = null
            )

            installExecutor.execute {
                runOfflineBackupInstall(url, sha256, expectedBytes.toLong())
            }

            promise.resolve(buildOfflineBackupStatus())
        } catch (error: Exception) {
            installRunning.set(false)
            Log.e(TAG, "startOfflineBackupInstall failed", error)
            promise.reject("offline_backup_start_failed", error.message, error)
        }
    }

    @ReactMethod
    fun complete(messagesJson: String, optionsJson: String?, promise: Promise) {
        try {
            Log.i(TAG, "complete called messagesLength=${messagesJson.length}")
            if (!initializeIfNeeded(activeModelPath)) {
                Log.w(TAG, "complete aborting because initializeIfNeeded returned false")
                promise.reject("cactus_model_missing", "Local model is not available on the device.")
                return
            }

            val result = cactusComplete(handle, messagesJson, optionsJson, null, null, null)
            Log.i(TAG, "complete succeeded resultLength=${result.length}")
            promise.resolve(result)
        } catch (error: Exception) {
            Log.e(TAG, "complete failed", error)
            promise.reject("cactus_complete_failed", error.message, error)
        }
    }
}
