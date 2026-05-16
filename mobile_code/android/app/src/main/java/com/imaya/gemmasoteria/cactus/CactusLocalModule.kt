package com.imaya.gemmasoteria.cactus

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
import java.io.File

class CactusLocalModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val TAG = "CactusLocalModule"
    }

    private var handle: Long = 0L
    private var activeModelPath: String? = null
    private var lastPrepError: String? = null

    override fun getName(): String = "CactusLocalModule"

    private fun filesDirModelPath(): String =
        File(reactContext.filesDir, "cactus/gemma-4-e2b-it").absolutePath

    private fun noBackupModelPath(): String =
        File(reactContext.noBackupFilesDir, "cactus/gemma-4-e2b-it").absolutePath

    private fun externalModelPath(): String {
        val base = reactContext.getExternalFilesDir(null) ?: reactContext.filesDir
        return File(base, "cactus/gemma-4-e2b-it").absolutePath
    }

    private fun defaultModelPath(): String {
        return noBackupModelPath()
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

        source.inputStream().use { input ->
            target.outputStream().use { output ->
                input.copyTo(output)
            }
        }
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

        if (canonicalDir.exists()) {
            lastPrepError = null
            Log.i(TAG, "prepareModelInternal canonical model already present at $canonicalPath")
            return true
        }

        val source = candidatePaths
            .asSequence()
            .map(::File)
            .firstOrNull { it.exists() && it.isDirectory && it.canRead() && it.absolutePath != canonicalPath }

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
        val modelPath = activeModelPath ?: defaultModelPath()
        val modelDir = File(modelPath)
        val modelExists = modelDir.exists()
        val initialized = handle != 0L
        val nativeError = cactusGetLastError().ifEmpty { null }
        val lastError = lastPrepError ?: nativeError
        Log.i(
            TAG,
            "buildStatus path=$modelPath exists=$modelExists isDir=${modelDir.isDirectory} files=${modelDir.list()?.size ?: -1} initialized=$initialized lastError=$lastError"
        )
        putBoolean("isSupported", true)
        putString("modelPath", modelPath)
        putBoolean("modelExists", modelExists)
        putBoolean("initialized", initialized)
        putString("lastError", lastError)
    }

    private fun initializeIfNeeded(modelPath: String?): Boolean {
        val resolvedPath = modelPath?.takeIf { it.isNotBlank() } ?: defaultModelPath()
        val modelDir = File(resolvedPath)
        activeModelPath = resolvedPath
        Log.i(
            TAG,
            "initializeIfNeeded resolvedPath=$resolvedPath exists=${modelDir.exists()} isDir=${modelDir.isDirectory} files=${modelDir.list()?.size ?: -1} currentHandle=$handle"
        )

        if (!modelDir.exists()) {
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

    @ReactMethod
    fun getStatus(promise: Promise) {
        Log.i(TAG, "getStatus called")
        promise.resolve(buildStatus())
    }

    @ReactMethod
    fun prepareModel(promise: Promise) {
        try {
            val prepared = prepareModelInternal()
            Log.i(TAG, "prepareModel called result=$prepared")
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
            promise.resolve(buildStatus())
        } catch (error: Exception) {
            Log.e(TAG, "initialize failed", error)
            promise.reject("cactus_init_failed", error.message, error)
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
