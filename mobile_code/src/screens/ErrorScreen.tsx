import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ErrorScreen({
  message,
  onRetry,
  onReset
}: {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.primary} onPress={onRetry}>
        <Text style={styles.primaryLabel}>Retry</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={onReset}>
        <Text style={styles.secondaryLabel}>Start again</Text>
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
