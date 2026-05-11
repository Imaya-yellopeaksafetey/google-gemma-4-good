import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ad3f2f" />
      <Text style={styles.title}>Building emergency response…</Text>
      <Text style={styles.sub}>Please wait while the controller checks the chemical and incident details.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  title: { fontSize: 22, fontWeight: "800", color: "#1c1c1c", textAlign: "center" },
  sub: { fontSize: 15, color: "#5d5648", textAlign: "center", lineHeight: 22 }
});
