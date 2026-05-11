import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { ChemicalPicker } from "@/features/catalog/ChemicalPicker";
import { getStrings } from "@/i18n/strings";
import type { ChemicalOptionViewModel } from "@/models/viewModels";

export function ManualSelectionScreen({
  chemicals,
  onSelect,
  onBack,
  language
}: {
  chemicals: ChemicalOptionViewModel[];
  onSelect: (chemical: ChemicalOptionViewModel) => void;
  onBack: () => void;
  language: SupportedLanguage;
}) {
  const strings = getStrings(language);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{strings.manualHeading}</Text>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>{strings.backToQrLabel}</Text>
        </Pressable>
      </View>
      <ChemicalPicker chemicals={chemicals} onSelect={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { gap: 6 },
  heading: { fontSize: 24, fontWeight: "800", color: "#1a1a1a" },
  back: { color: "#8c4f13", fontWeight: "700" }
});
