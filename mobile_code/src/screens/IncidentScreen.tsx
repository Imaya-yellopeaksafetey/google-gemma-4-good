import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { ChemicalOptionViewModel } from "@/models/viewModels";

const QUICK_CHIPS = ["eye", "skin", "inhaled", "entered mouth"];

export function IncidentScreen({
  chemical,
  query,
  onChangeQuery,
  onQuickChip,
  onSubmit,
  onResetChemical
}: {
  chemical: ChemicalOptionViewModel;
  query: string;
  onChangeQuery: (value: string) => void;
  onQuickChip: (value: string) => void;
  onSubmit: () => void;
  onResetChemical: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.chemicalBox}>
        <Text style={styles.chemicalTitle}>Chemical locked</Text>
        <Text style={styles.chemicalName}>{chemical.localizedName}</Text>
        <Pressable onPress={onResetChemical}>
          <Text style={styles.changeLink}>Change chemical</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>What happened?</Text>
      <TextInput
        value={query}
        onChangeText={onChangeQuery}
        multiline
        placeholder="Example: spray went in my eye"
        style={styles.input}
      />
      <View style={styles.chips}>
        {QUICK_CHIPS.map((chip) => (
          <Pressable key={chip} style={styles.chip} onPress={() => onQuickChip(chip)}>
            <Text style={styles.chipLabel}>{chip}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[styles.submit, !query.trim() && styles.submitDisabled]} onPress={onSubmit} disabled={!query.trim()}>
        <Text style={styles.submitLabel}>Get emergency response</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  chemicalBox: {
    borderRadius: 16,
    backgroundColor: "#f5f2e9",
    padding: 14,
    gap: 6
  },
  chemicalTitle: { fontWeight: "800", color: "#6f5c3a" },
  chemicalName: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  changeLink: { color: "#8c4f13", fontWeight: "700" },
  heading: { fontSize: 24, fontWeight: "800", color: "#1a1a1a" },
  input: {
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9cfbf",
    padding: 14,
    fontSize: 16,
    textAlignVertical: "top"
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff6df",
    borderWidth: 1,
    borderColor: "#ebc57f"
  },
  chipLabel: { fontWeight: "700", color: "#68451a" },
  submit: {
    marginTop: 8,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#ad3f2f",
    alignItems: "center"
  },
  submitDisabled: {
    opacity: 0.45
  },
  submitLabel: { color: "#fff", fontWeight: "800", fontSize: 16 }
});
