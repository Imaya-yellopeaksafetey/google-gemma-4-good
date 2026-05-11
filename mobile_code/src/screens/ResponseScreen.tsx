import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ModeBadge } from "@/components/ModeBadge";
import { SectionCard } from "@/components/SectionCard";
import type { EmergencyResponseViewModel } from "@/models/viewModels";

export function ResponseScreen({
  response,
  chemicalLabel,
  onStartOver
}: {
  response: EmergencyResponseViewModel;
  chemicalLabel: string;
  onStartOver: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.topLabel}>{chemicalLabel}</Text>
      <ModeBadge mode={response.mode} />

      <SectionCard title="Incident summary">
        <Text style={styles.body}>{response.incidentSummary}</Text>
      </SectionCard>

      <SectionCard title="Immediate actions">
        {response.immediateActions.map((item, index) => (
          <Text key={`${index}-${item}`} style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
        ))}
      </SectionCard>

      <SectionCard title="Do not do">
        {response.doNotDo.length ? response.doNotDo.map((item, index) => (
          <Text key={`${index}-${item}`} style={styles.listItem}>{`\u2022 ${item}`}</Text>
        )) : <Text style={styles.body}>No additional do-not guidance returned.</Text>}
      </SectionCard>

      <SectionCard title="Escalate now">
        <Text style={styles.escalate}>{response.escalateInstruction}</Text>
      </SectionCard>

      {response.fallbackReason ? (
        <SectionCard title="Why this response is guarded">
          <Text style={styles.body}>{response.fallbackReason}</Text>
        </SectionCard>
      ) : null}

      {response.evidenceLabel ? (
        <SectionCard title="Evidence basis">
          <Text style={styles.body}>{response.evidenceLabel}</Text>
        </SectionCard>
      ) : null}

      <Pressable style={styles.button} onPress={onStartOver}>
        <Text style={styles.buttonLabel}>Start new response</Text>
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
