import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";

const LANGUAGE_OPTIONS: { key: SupportedLanguage; label: string }[] = [
  { key: "english", label: "English" },
  { key: "malay", label: "Bahasa Melayu" },
  { key: "bangla", label: "বাংলা" },
  { key: "bahasa_indonesia", label: "Bahasa Indonesia" }
];

export function LanguageScreen({
  selectedLanguage,
  onSelect,
  onContinue
}: {
  selectedLanguage: SupportedLanguage;
  onSelect: (language: SupportedLanguage) => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose language</Text>
      <Text style={styles.subheading}>Set the language first. This will be used for chemical labels and the response.</Text>
      <View style={styles.list}>
        {LANGUAGE_OPTIONS.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.option, selectedLanguage === item.key && styles.optionSelected]}
            onPress={() => onSelect(item.key)}
          >
            <Text style={[styles.optionLabel, selectedLanguage === item.key && styles.optionLabelSelected]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryLabel}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18 },
  heading: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  subheading: { fontSize: 15, color: "#544d42", lineHeight: 22 },
  list: { gap: 10 },
  option: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9cfbf"
  },
  optionSelected: {
    backgroundColor: "#1f5f4a",
    borderColor: "#1f5f4a"
  },
  optionLabel: { fontSize: 17, fontWeight: "700", color: "#1c1c1c" },
  optionLabelSelected: { color: "#fff" },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#ad3f2f",
    alignItems: "center"
  },
  primaryLabel: { color: "#fff", fontSize: 16, fontWeight: "800" }
});
