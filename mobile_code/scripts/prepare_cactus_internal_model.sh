#!/bin/bash
set -euo pipefail

SERIAL="${1:-emulator-5554}"
MODEL_SRC="${2:-/private/tmp/cactus_android_weights/gemma-4-e2b-it}"
PKG="com.imaya.gemmasoteria"
TARGET_BASE="/data/user/0/${PKG}/no_backup/cactus"
TARGET_PATH="${TARGET_BASE}/gemma-4-e2b-it"
EXTERNAL_STAGING="/storage/emulated/0/Android/data/${PKG}/files/cactus/gemma-4-e2b-it"

if [ ! -d "${MODEL_SRC}" ]; then
  echo "Model source directory not found: ${MODEL_SRC}" >&2
  exit 1
fi

adb -s "${SERIAL}" root >/dev/null 2>&1 || true
adb -s "${SERIAL}" wait-for-device

APP_UID="$(adb -s "${SERIAL}" shell dumpsys package "${PKG}" | sed -n 's/.*appId=//p; s/.*userId=//p' | head -n1 | tr -d '\r')"

if [ -z "${APP_UID}" ]; then
  echo "Unable to resolve package uid for ${PKG}" >&2
  exit 1
fi

echo "Preparing model for ${PKG} on ${SERIAL}"
echo "Source: ${MODEL_SRC}"
echo "Target: ${TARGET_PATH}"
echo "UID: ${APP_UID}"

echo "Free space before staging:"
adb -s "${SERIAL}" shell "df -h /data /storage/emulated | tail -n +2"

echo "Removing old external staging copy, if present, to free /data space"
adb -s "${SERIAL}" shell "rm -rf '${EXTERNAL_STAGING}'"

adb -s "${SERIAL}" shell "rm -rf '${TARGET_PATH}' && mkdir -p '${TARGET_BASE}'"
adb -s "${SERIAL}" push "${MODEL_SRC}" "${TARGET_BASE}/"
adb -s "${SERIAL}" shell "chown -R ${APP_UID}:${APP_UID} '${TARGET_BASE}' && chmod -R u+rwX '${TARGET_BASE}'"
adb -s "${SERIAL}" shell "ls -ld '${TARGET_BASE}' '${TARGET_PATH}' && test -f '${TARGET_PATH}/config.txt' && echo config_ok && df -h /data /storage/emulated | tail -n +2"
