import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { getStrings } from "@/i18n/strings";

export function LoadingScreen({ language, startup = false }: { language: SupportedLanguage; startup?: boolean }) {
  const strings = getStrings(language);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ad3f2f" />
      <Text style={styles.title}>{startup ? strings.startupLoadingTitle : strings.loadingTitle}</Text>
      <Text style={styles.sub}>{startup ? strings.startupLoadingSub : strings.loadingSub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  title: { fontSize: 22, fontWeight: "800", color: "#1c1c1c", textAlign: "center" },
  sub: { fontSize: 15, color: "#5d5648", textAlign: "center", lineHeight: 22 }
});
