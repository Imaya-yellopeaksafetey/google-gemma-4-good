import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AppShell } from "./src/app/AppShell";
import { AppSessionProvider } from "./src/state/AppSessionContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSessionProvider>
        <StatusBar style="dark" />
        <AppShell />
      </AppSessionProvider>
    </SafeAreaProvider>
  );
}
