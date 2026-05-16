import React, { createContext, useContext, useMemo, useReducer } from "react";

import type { SupportedLanguage } from "@/api/types";
import type { AppResponseViewModel, ChemicalOptionViewModel, RuntimeStateViewModel } from "@/models/viewModels";

type ScreenState = "language" | "entry" | "incident" | "loading" | "response" | "error";

type AppSessionState = {
  screen: ScreenState;
  language: SupportedLanguage;
  selectedChemical: ChemicalOptionViewModel | null;
  response: AppResponseViewModel | null;
  incidentQuery: string;
  lastError: string | null;
  runtime: RuntimeStateViewModel;
};

type Action =
  | { type: "SET_LANGUAGE"; payload: SupportedLanguage }
  | { type: "SET_SCREEN"; payload: ScreenState }
  | { type: "SET_CHEMICAL"; payload: ChemicalOptionViewModel | null }
  | { type: "SET_RESPONSE"; payload: AppResponseViewModel | null }
  | { type: "SET_INCIDENT_QUERY"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RUNTIME"; payload: Partial<RuntimeStateViewModel> }
  | { type: "RESET_FLOW" };

const initialState: AppSessionState = {
  screen: "language",
  language: "english",
  selectedChemical: null,
  response: null,
  incidentQuery: "",
  lastError: null,
  runtime: {
    backendReachable: false,
    localCatalogSource: "embedded_local",
    localModelAvailable: false,
    localModelInitialized: false,
    localModelError: null,
    operatingMode: "online_full"
  }
};

function reducer(state: AppSessionState, action: Action): AppSessionState {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_SCREEN":
      return { ...state, screen: action.payload };
    case "SET_CHEMICAL":
      return { ...state, selectedChemical: action.payload };
    case "SET_RESPONSE":
      return { ...state, response: action.payload };
    case "SET_INCIDENT_QUERY":
      return { ...state, incidentQuery: action.payload };
    case "SET_ERROR":
      return { ...state, lastError: action.payload };
    case "SET_RUNTIME":
      return { ...state, runtime: { ...state.runtime, ...action.payload } };
    case "RESET_FLOW":
      return { ...state, screen: "entry", selectedChemical: null, response: null, incidentQuery: "", lastError: null };
    default:
      return state;
  }
}

const AppSessionContext = createContext<{
  state: AppSessionState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
}

export function useAppSession() {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error("useAppSession must be used inside AppSessionProvider");
  }
  return context;
}
