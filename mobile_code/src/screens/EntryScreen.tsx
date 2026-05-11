import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { QRScannerPanel } from "@/features/qr/QRScannerPanel";
import type { ChemicalOptionViewModel } from "@/models/viewModels";

export function EntryScreen({
  selectedChemical,
  onResolveQr,
  onOpenManual,
  onProceedToIncident
}: {
  selectedChemical: ChemicalOptionViewModel | null;
  onResolveQr: (qrValue: string) => Promise<void>;
  onOpenManual: () => void;
  onProceedToIncident: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Scan the chemical QR first</Text>
      <Text style={styles.subheading}>If the QR is missing or damaged, choose the chemical manually.</Text>
      <QRScannerPanel onDecoded={onResolveQr} onManualFallback={onOpenManual} />
      {selectedChemical ? (
        <View style={styles.lockBox}>
          <Text style={styles.lockHeading}>Chemical locked</Text>
          <Text style={styles.lockValue}>{selectedChemical.localizedName}</Text>
          <Pressable style={styles.primaryButton} onPress={onProceedToIncident}>
            <Text style={styles.primaryLabel}>Describe what happened</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingBottom: 24 },
  heading: { fontSize: 26, fontWeight: "800", color: "#1a1a1a" },
  subheading: { fontSize: 15, color: "#544d42", lineHeight: 22 },
  lockBox: {
    borderRadius: 18,
    backgroundColor: "#edf6ef",
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#c8dfce"
  },
  lockHeading: { fontWeight: "800", color: "#24543f" },
  lockValue: { fontSize: 18, fontWeight: "700", color: "#1b1b1b" },
  primaryButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#1f5f4a",
    alignItems: "center"
  },
  primaryLabel: { color: "#fff", fontWeight: "800" }
});
