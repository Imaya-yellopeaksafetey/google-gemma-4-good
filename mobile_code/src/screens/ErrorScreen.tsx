import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { getStrings } from "@/i18n/strings";

export function ErrorScreen({
  message,
  onRetry,
  onReset,
  language
}: {
  message: string;
  onRetry: () => void;
  onReset: () => void;
  language: SupportedLanguage;
}) {
  const strings = getStrings(language);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{strings.genericErrorHeading}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.primary} onPress={onRetry}>
        <Text style={styles.primaryLabel}>{strings.retryLabel}</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={onReset}>
        <Text style={styles.secondaryLabel}>{strings.resetLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  heading: { fontSize: 26, fontWeight: "800", color: "#8d2b1f" },
  message: { fontSize: 16, color: "#403a32", lineHeight: 24 },
  primary: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#ad3f2f",
    alignItems: "center"
  },
  primaryLabel: { color: "#fff", fontWeight: "800" },
  secondary: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0c7c1",
    alignItems: "center"
  },
  secondaryLabel: { color: "#8d2b1f", fontWeight: "700" }
});
