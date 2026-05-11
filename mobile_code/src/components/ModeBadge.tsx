import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { EmergencyResponseViewModel } from "@/models/viewModels";

export function ModeBadge({ mode }: { mode: EmergencyResponseViewModel["mode"] }) {
  return (
    <View
      style={[
        styles.base,
        mode.tone === "safe" && styles.safe,
        mode.tone === "warn" && styles.warn,
        mode.tone === "critical" && styles.critical
      ]}
    >
      <Text style={styles.label}>{mode.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999
  },
  safe: { backgroundColor: "#dff5e7" },
  warn: { backgroundColor: "#fff1cf" },
  critical: { backgroundColor: "#ffd6d0" },
  label: {
    fontWeight: "800",
    color: "#1b1b1b"
  }
});
