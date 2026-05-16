import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import type { SupportedLanguage } from "@/api/types";
import { ModeBadge } from "@/components/ModeBadge";
import { SectionCard } from "@/components/SectionCard";
import { getStrings } from "@/i18n/strings";
import type { AppResponseViewModel } from "@/models/viewModels";

function getRouteLabel(language: SupportedLanguage, routeKey: AppResponseViewModel["provenance"]["routeKey"]): string {
  const labels = {
    cloud_controller: {
      english: "Cloud controller route",
      malay: "Laluan pengawal awan",
      bangla: "ক্লাউড কন্ট্রোলার রুট",
      bahasa_indonesia: "Rute pengendali cloud"
    },
    hybrid_local_then_cloud: {
      english: "Local model then cloud route",
      malay: "Model setempat kemudian laluan awan",
      bangla: "লোকাল মডেল তারপর ক্লাউড রুট",
      bahasa_indonesia: "Model lokal lalu rute cloud"
    },
    local_quick_then_cloud: {
      english: "Local quick card then cloud route",
      malay: "Kad ringkas setempat kemudian laluan awan",
      bangla: "লোকাল কুইক কার্ড তারপর ক্লাউড রুট",
      bahasa_indonesia: "Kartu cepat lokal lalu rute cloud"
    },
    cloud_failed_keep_local: {
      english: "Cloud failed, local card kept",
      malay: "Awan gagal, kad setempat dikekalkan",
      bangla: "ক্লাউড ব্যর্থ, লোকাল কার্ড রাখা হয়েছে",
      bahasa_indonesia: "Cloud gagal, kartu lokal dipertahankan"
    },
    local_guarded_offline: {
      english: "Local guarded offline route",
      malay: "Laluan luar talian berjaga-jaga setempat",
      bangla: "লোকাল সতর্ক অফলাইন রুট",
      bahasa_indonesia: "Rute offline berjaga lokal"
    },
    local_clarify: {
      english: "Local clarify route",
      malay: "Laluan penjelasan setempat",
      bangla: "লোকাল স্পষ্টকরণ রুট",
      bahasa_indonesia: "Rute klarifikasi lokal"
    },
    local_preventive_limited: {
      english: "Local limited preventive route",
      malay: "Laluan pencegahan terhad setempat",
      bangla: "লোকাল সীমিত প্রতিরোধ রুট",
      bahasa_indonesia: "Rute preventif lokal terbatas"
    }
  } as const;

  return labels[routeKey][language];
}

export function ResponseScreen({
  response,
  chemicalLabel,
  onStartOver,
  language
}: {
  response: AppResponseViewModel;
  chemicalLabel: string;
  onStartOver: () => void;
  language: SupportedLanguage;
}) {
  const strings = getStrings(language);
  const showIncidentSummary = response.kind === "emergency" && response.incidentSummary.trim().length > 0;
  const currentRenderedSource = response.upgrade?.phase === "cloud_complete"
    ? (language === "english"
      ? "Cloud response currently shown"
      : language === "malay"
        ? "Respons awan sedang dipaparkan"
        : language === "bangla"
          ? "বর্তমানে ক্লাউড প্রতিক্রিয়া দেখানো হচ্ছে"
          : "Respons cloud sedang ditampilkan")
    : response.upgrade?.phase === "cloud_failed_keep_local"
      ? (language === "english"
        ? "Local quick card retained after cloud failure"
        : language === "malay"
          ? "Kad ringkas setempat dikekalkan selepas kegagalan awan"
          : language === "bangla"
            ? "ক্লাউড ব্যর্থ হওয়ার পর লোকাল কুইক কার্ড রাখা হয়েছে"
            : "Kartu cepat lokal dipertahankan setelah cloud gagal")
      : response.provenance.localModelUsed && response.provenance.cloudUsed
        ? (language === "english"
          ? "Local first, cloud final path in progress"
          : language === "malay"
            ? "Laluan setempat dahulu, awan akhir sedang berjalan"
            : language === "bangla"
              ? "লোকাল আগে, ক্লাউড চূড়ান্ত পথ চলছে"
              : "Lokal dulu, jalur akhir cloud sedang berjalan")
        : response.provenance.localModelUsed
          ? (language === "english"
            ? "Local model response currently shown"
            : language === "malay"
              ? "Respons model setempat sedang dipaparkan"
              : language === "bangla"
                ? "বর্তমানে লোকাল মডেলের প্রতিক্রিয়া দেখানো হচ্ছে"
                : "Respons model lokal sedang ditampilkan")
          : (language === "english"
            ? "Cloud response currently shown"
            : language === "malay"
              ? "Respons awan sedang dipaparkan"
              : language === "bangla"
                ? "বর্তমানে ক্লাউড প্রতিক্রিয়া দেখানো হচ্ছে"
                : "Respons cloud sedang ditampilkan");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.topLabel}>{chemicalLabel}</Text>
      <ModeBadge mode={response.mode} />

      {response.kind === "emergency" ? (
        <>
          {showIncidentSummary ? (
            <SectionCard title={strings.incidentSummaryTitle}>
              <Text style={styles.body}>{response.incidentSummary}</Text>
            </SectionCard>
          ) : null}

          <SectionCard title={strings.immediateActionsTitle}>
            {response.immediateActions.map((item, index) => (
              <Text key={`${index}-${item}`} style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
            ))}
          </SectionCard>

          <SectionCard title={strings.doNotDoTitle}>
            {response.doNotDo.length ? response.doNotDo.map((item, index) => (
              <Text key={`${index}-${item}`} style={styles.listItem}>{`\u2022 ${item}`}</Text>
            )) : <Text style={styles.body}>{strings.doNotDoEmpty}</Text>}
          </SectionCard>

          <SectionCard title={strings.escalateNowTitle}>
            <Text style={styles.escalate}>{response.escalateInstruction}</Text>
          </SectionCard>

          {response.fallbackReason ? (
            <SectionCard title={strings.guardedWhyTitle}>
              <Text style={styles.body}>{response.fallbackReason}</Text>
            </SectionCard>
          ) : null}
        </>
      ) : null}

      {response.kind === "preventive" ? (
        <>
          <SectionCard title={strings.preventiveSummaryTitle}>
            <Text style={styles.body}>{response.guidanceSummary}</Text>
          </SectionCard>

          <SectionCard title={strings.preventiveActionsTitle}>
            {response.recommendedActions.map((item, index) => (
              <Text key={`${index}-${item}`} style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
            ))}
          </SectionCard>

          <SectionCard title={strings.preventiveAvoidTitle}>
            {response.avoidActions.map((item, index) => (
              <Text key={`${index}-${item}`} style={styles.listItem}>{`\u2022 ${item}`}</Text>
            ))}
          </SectionCard>

          {response.followUpNote ? (
            <SectionCard title={strings.preventiveFollowUpTitle}>
              <Text style={styles.body}>{response.followUpNote}</Text>
            </SectionCard>
          ) : null}
        </>
      ) : null}

      {response.kind === "clarify" ? (
        <>
          <SectionCard title={strings.clarifyTitle}>
            <Text style={styles.body}>{response.clarificationPrompt}</Text>
          </SectionCard>

          <SectionCard title={strings.clarifyOptionsTitle}>
            {response.suggestedOptions.map((item, index) => (
              <Text key={`${index}-${item}`} style={styles.listItem}>{`${index + 1}. ${item}`}</Text>
            ))}
          </SectionCard>
        </>
      ) : null}

      {response.upgrade ? (
        <SectionCard title={strings.routeStatusTitle}>
          <Text style={styles.body}>{response.upgrade.title}</Text>
          <Text style={styles.metaText}>{response.upgrade.body}</Text>
        </SectionCard>
      ) : null}

      {response.evidenceLabel ? (
        <SectionCard title={strings.evidenceBasisTitle}>
          <Text style={styles.body}>{response.evidenceLabel}</Text>
        </SectionCard>
      ) : null}

      <SectionCard title={language === "english" ? "Debug source" : language === "malay" ? "Sumber nyahpepijat" : language === "bangla" ? "ডিবাগ উৎস" : "Sumber debug"}>
        <Text style={styles.body}>{currentRenderedSource}</Text>
        <Text style={styles.metaText}>
          {`kind=${response.kind} | route=${response.provenance.routeKey} | upgrade=${response.upgrade?.phase ?? "none"}`}
        </Text>
      </SectionCard>

      <SectionCard title={language === "english" ? "Route proof" : language === "malay" ? "Bukti laluan" : language === "bangla" ? "রুট প্রমাণ" : "Bukti rute"}>
        <Text style={styles.body}>{getRouteLabel(language, response.provenance.routeKey)}</Text>
        <Text style={styles.metaText}>{response.provenance.explanation}</Text>
        <Text style={styles.metaText}>
          {response.provenance.localModelUsed ? "Local model used. " : "Local model not used. "}
          {response.provenance.cloudUsed ? "Cloud response used." : "Cloud response not used."}
        </Text>
      </SectionCard>

      <Pressable style={styles.button} onPress={onStartOver}>
        <Text style={styles.buttonLabel}>{strings.startNewResponseLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, paddingBottom: 24 },
  topLabel: { color: "#755723", fontWeight: "800", fontSize: 16 },
  body: { fontSize: 15, color: "#313131", lineHeight: 22 },
  metaText: { fontSize: 13, color: "#5b584d", lineHeight: 18 },
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
