import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { ModeBadge } from "@/components/ModeBadge";
import { SectionCard } from "@/components/SectionCard";
import { getStrings } from "@/i18n/strings";
import type { EmergencyResponseViewModel } from "@/models/viewModels";

export function ResponseScreen({
  response,
  chemicalLabel,
  onStartOver,
  language
}: {
  response: EmergencyResponseViewModel;
  chemicalLabel: string;
  onStartOver: () => void;
  language: SupportedLanguage;
}) {
  const strings = getStrings(language);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.topLabel}>{chemicalLabel}</Text>
      <ModeBadge mode={response.mode} />

      <SectionCard title={strings.incidentSummaryTitle}>
        <Text style={styles.body}>{response.incidentSummary}</Text>
      </SectionCard>

      <SectionCard title={strings.immediateActionsTitle}>
        {response.immediateActions.map((item, index) => (
          <Text key={`${index}-${item}`} style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
        ))}
      </SectionCard>

      <SectionCard title={strings.doNotDoTitle}>
        {response.doNotDo.length ? response.doNotDo.map((item, index) => (
          <Text key={`${index}-${item}`} style={styles.listItem}>{`\u2022 ${item}`}</Text>
        )) : <Text style={styles.body}>{strings.doNotDoEmpty}</Text>}
      </SectionCard>

      <SectionCard title={strings.escalateNowTitle}>
        <Text style={styles.escalate}>{response.escalateInstruction}</Text>
      </SectionCard>

      {response.fallbackReason ? (
        <SectionCard title={strings.guardedWhyTitle}>
          <Text style={styles.body}>{response.fallbackReason}</Text>
        </SectionCard>
      ) : null}

      {response.evidenceLabel ? (
        <SectionCard title={strings.evidenceBasisTitle}>
          <Text style={styles.body}>{response.evidenceLabel}</Text>
        </SectionCard>
      ) : null}

      <Pressable style={styles.button} onPress={onStartOver}>
        <Text style={styles.buttonLabel}>{strings.startNewResponseLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, paddingBottom: 24 },
  topLabel: { color: "#755723", fontWeight: "800", fontSize: 16 },
  body: { fontSize: 15, color: "#313131", lineHeight: 22 },
  listItem: { fontSize: 16, color: "#1f1f1f", lineHeight: 24 },
  escalate: { fontSize: 18, fontWeight: "800", color: "#9b231c", lineHeight: 26 },
  button: {
    marginTop: 6,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#1f5f4a",
    alignItems: "center"
  },
  buttonLabel: { color: "#fff", fontWeight: "800", fontSize: 16 }
});
