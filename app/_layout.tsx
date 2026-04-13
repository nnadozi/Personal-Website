import { Analytics } from "@vercel/analytics/react";
import Head from "expo-router/head";
import { Stack } from "expo-router";
import { Platform } from "react-native";

import { PROFILE } from "../constants/profile";

export default function RootLayout() {
  return (
    <>
      {/* Stack `title` does not reliably set `document.title` in web dev; Head does. */}
      <Head>
        <title>{PROFILE.fullName}</title>
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
          title: PROFILE.fullName,
          // Keep a consistent background during transitions/loading.
          contentStyle: { backgroundColor: "#171717" },
        }}
      />
      {Platform.OS === "web" && <Analytics />}
    </>
  );
}
