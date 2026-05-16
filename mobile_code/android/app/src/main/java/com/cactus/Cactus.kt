package com.cactus

fun interface CactusTokenCallback {
    fun onToken(token: String, tokenId: Int)
}

fun interface CactusLogCallback {
    fun onLog(level: Int, component: String, message: String)
}

private object CactusJNI {
    init {
        System.loadLibrary("cactus")
        nativeSetFramework()
    }

    @JvmStatic external fun nativeSetFramework()
    @JvmStatic external fun nativeGetLastError(): String
    @JvmStatic external fun nativeSetCacheDir(cacheDir: String)
    @JvmStatic external fun nativeSetAppId(appId: String)
    @JvmStatic external fun nativeTelemetryFlush()
    @JvmStatic external fun nativeTelemetryShutdown()
    @JvmStatic external fun nativeInit(modelPath: String, corpusDir: String?, cacheIndex: Boolean): Long
    @JvmStatic external fun nativeDestroy(handle: Long)
    @JvmStatic external fun nativeReset(handle: Long)
    @JvmStatic external fun nativeStop(handle: Long)
    @JvmStatic external fun nativeComplete(handle: Long, messagesJson: String, optionsJson: String?, toolsJson: String?, callback: CactusTokenCallback?, pcmData: ByteArray?): String
    @JvmStatic external fun nativePrefill(handle: Long, messagesJson: String, optionsJson: String?, toolsJson: String?, pcmData: ByteArray?): String
    @JvmStatic external fun nativeDetectLanguage(handle: Long, audioPath: String?, optionsJson: String?, pcmData: ByteArray?): String
    @JvmStatic external fun nativeLogSetLevel(level: Int)
    @JvmStatic external fun nativeLogSetCallback(callback: CactusLogCallback?)
}

fun cactusInit(modelPath: String, corpusDir: String?, cacheIndex: Boolean): Long {
    val handle = CactusJNI.nativeInit(modelPath, corpusDir, cacheIndex)
    if (handle == 0L) {
        throw RuntimeException(CactusJNI.nativeGetLastError().ifEmpty { "Failed to initialize model" })
    }
    return handle
}

fun cactusDestroy(model: Long) = CactusJNI.nativeDestroy(model)
fun cactusReset(model: Long) = CactusJNI.nativeReset(model)
fun cactusStop(model: Long) = CactusJNI.nativeStop(model)
fun cactusGetLastError(): String = CactusJNI.nativeGetLastError()
fun cactusSetTelemetryEnvironment(cacheDir: String) = CactusJNI.nativeSetCacheDir(cacheDir)
fun cactusSetAppId(appId: String) = CactusJNI.nativeSetAppId(appId)
fun cactusTelemetryFlush() = CactusJNI.nativeTelemetryFlush()
fun cactusTelemetryShutdown() = CactusJNI.nativeTelemetryShutdown()
fun cactusComplete(model: Long, messagesJson: String, optionsJson: String?, toolsJson: String?, callback: CactusTokenCallback?, pcmData: ByteArray? = null): String =
    CactusJNI.nativeComplete(model, messagesJson, optionsJson, toolsJson, callback, pcmData)
fun cactusPrefill(model: Long, messagesJson: String, optionsJson: String?, toolsJson: String?, pcmData: ByteArray? = null): String =
    CactusJNI.nativePrefill(model, messagesJson, optionsJson, toolsJson, pcmData)
fun cactusDetectLanguage(model: Long, audioPath: String?, optionsJson: String?, pcmData: ByteArray?): String =
    CactusJNI.nativeDetectLanguage(model, audioPath, optionsJson, pcmData)
fun cactusLogSetLevel(level: Int) = CactusJNI.nativeLogSetLevel(level)
fun cactusLogSetCallback(callback: CactusLogCallback?) = CactusJNI.nativeLogSetCallback(callback)
