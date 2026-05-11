import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#e3dccd"
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1c1c1c"
  }
});
