import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { getStrings } from "@/i18n/strings";
import type { ChemicalOptionViewModel, OperatingModeViewModel } from "@/models/viewModels";

export function IncidentScreen({
  chemical,
  query,
  onChangeQuery,
  onQuickChip,
  onSubmit,
  onResetChemical,
  language,
  operatingMode
}: {
  chemical: ChemicalOptionViewModel;
  query: string;
  onChangeQuery: (value: string) => void;
  onQuickChip: (value: string) => void;
  onSubmit: () => void;
  onResetChemical: () => void;
  language: SupportedLanguage;
  operatingMode: OperatingModeViewModel;
}) {
  const strings = getStrings(language);
  const quickChips = [
    { label: strings.quickChips.eye, value: strings.quickChips.eye },
    { label: strings.quickChips.skin, value: strings.quickChips.skin },
    { label: strings.quickChips.inhaled, value: strings.quickChips.inhaled },
    { label: strings.quickChips.enteredMouth, value: strings.quickChips.enteredMouth }
      ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {operatingMode !== "online_full" ? (
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>
            {language === "english"
              ? "Limited local mode active"
              : language === "malay"
                ? "Mod setempat terhad aktif"
                : language === "bangla"
                  ? "সীমিত লোকাল মোড চালু"
                  : "Mode lokal terbatas aktif"}
          </Text>
          <Text style={styles.noticeBody}>
            {language === "english"
              ? "The app will prefer local routing and guarded fallback if cloud guidance is unavailable."
              : language === "malay"
                ? "Apl akan mengutamakan penghalaan setempat dan sandaran berjaga-jaga jika panduan awan tidak tersedia."
                : language === "bangla"
                  ? "ক্লাউড নির্দেশনা না থাকলে অ্যাপ লোকাল রাউটিং ও সতর্ক বিকল্প ব্যবহার করবে।"
                  : "Aplikasi akan memprioritaskan rute lokal dan fallback berjaga jika panduan cloud tidak tersedia."}
          </Text>
        </View>
      ) : null}
      <View style={styles.chemicalBox}>
        <Text style={styles.chemicalTitle}>{strings.lockedChemicalLabel}</Text>
        <Text style={styles.chemicalName}>{chemical.localizedName}</Text>
        <Pressable onPress={onResetChemical}>
          <Text style={styles.changeLink}>{strings.changeChemicalLabel}</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>{strings.incidentHeading}</Text>
      <TextInput
        value={query}
        onChangeText={onChangeQuery}
        multiline
        placeholder={strings.incidentPlaceholder}
        style={styles.input}
      />
      <View style={styles.chips}>
        {quickChips.map((chip) => (
          <Pressable key={chip.value} style={styles.chip} onPress={() => onQuickChip(chip.value)}>
            <Text style={styles.chipLabel}>{chip.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[styles.submit, !query.trim() && styles.submitDisabled]} onPress={onSubmit} disabled={!query.trim()}>
        <Text style={styles.submitLabel}>{strings.submitIncidentLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { gap: 14, paddingBottom: 24 },
  noticeBox: {
    borderRadius: 16,
    backgroundColor: "#fff6df",
    borderWidth: 1,
    borderColor: "#ebc57f",
    padding: 12,
    gap: 4
  },
  noticeTitle: {
    fontWeight: "800",
    color: "#68451a"
  },
  noticeBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "#5b584d"
  },
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
