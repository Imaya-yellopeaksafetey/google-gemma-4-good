import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { useQrScanner } from "./useQrScanner";

type Props = {
  onDecoded: (qrValue: string) => Promise<void>;
  onManualFallback: () => void;
};

export function QRScannerPanel({ onDecoded, onManualFallback }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const { scanLocked, handleScanned } = useQrScanner(onDecoded);

  if (!permission) {
    return <Text style={styles.helper}>Checking camera permission…</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.title}>Allow camera to scan the chemical QR</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryLabel}>Enable camera</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onManualFallback}>
          <Text style={styles.secondaryLabel}>Choose chemical manually</Text>
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
      <Text style={styles.helper}>{scanLocked ? "QR captured. Resolving…" : "Point camera at chemical QR code."}</Text>
      <Pressable style={styles.secondaryButton} onPress={onManualFallback}>
        <Text style={styles.secondaryLabel}>Choose chemical manually</Text>
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
