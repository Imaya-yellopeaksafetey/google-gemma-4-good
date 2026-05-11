import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import type { ChemicalOptionViewModel } from "@/models/viewModels";

type Props = {
  chemicals: ChemicalOptionViewModel[];
  onSelect: (chemical: ChemicalOptionViewModel) => void;
};

export function ChemicalPicker({ chemicals, onSelect }: Props) {
  return (
    <FlatList
      data={chemicals}
      keyExtractor={(item) => item.chemicalId}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => onSelect(item)}>
          <Text style={styles.shortLabel}>{item.shortLabel}</Text>
          <Text style={styles.name}>{item.localizedName}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    paddingBottom: 12
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8d1c3"
  },
  shortLabel: {
    color: "#815b28",
    fontWeight: "800",
    marginBottom: 4
  },
  name: {
    color: "#1f1f1f",
    fontSize: 16,
    fontWeight: "600"
  }
});
