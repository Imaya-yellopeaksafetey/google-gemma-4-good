import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import type { SupportedLanguage } from "@/api/types";
import { getStrings } from "@/i18n/strings";
import { useQrScanner } from "./useQrScanner";

type Props = {
  onDecoded: (qrValue: string) => Promise<void>;
  onManualFallback: () => void;
  language: SupportedLanguage;
};

export function QRScannerPanel({ onDecoded, onManualFallback, language }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const { scanLocked, handleScanned } = useQrScanner(onDecoded);
  const strings = getStrings(language);

  if (!permission) {
    return <Text style={styles.helper}>{strings.checkingCameraPermission}</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.title}>{strings.cameraPermissionTitle}</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryLabel}>{strings.enableCameraLabel}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onManualFallback}>
          <Text style={styles.secondaryLabel}>{strings.manualFallbackLabel}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(event) => handleScanned(event.data)}
      />
      <Text style={styles.helper}>{scanLocked ? strings.qrCapturedResolving : strings.pointCameraLabel}</Text>
      <Pressable style={styles.secondaryButton} onPress={onManualFallback}>
        <Text style={styles.secondaryLabel}>{strings.manualFallbackLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  camera: {
    height: 280,
    borderRadius: 20,
    overflow: "hidden"
  },
  helper: {
    color: "#4a4a4a",
    fontSize: 14
  },
  permissionBox: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff8ee"
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1c1c1c"
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#1f5f4a",
    alignItems: "center"
  },
  primaryLabel: { color: "#fff", fontWeight: "700" },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d5c7b0",
    alignItems: "center"
  },
  secondaryLabel: { color: "#4b3d2a", fontWeight: "600" }
});
