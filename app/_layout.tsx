import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";

import {
  LearnLoopProvider,
  useLearnLoop,
} from "@/context/LearnLoopContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const {
    authUser,
    authLoading,
  } = useLearnLoop();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const firstSegment =
      segments[0] as string | undefined;

    const inAuth =
      firstSegment === "auth";

    // NOT LOGGED IN
    // Only authentication screens are allowed.
    if (!authUser && !inAuth) {
      router.replace("/auth/login");
      return;
    }

    // LOGGED IN
    // Authentication screens are no longer allowed.
    if (authUser && inAuth) {
      router.replace("/(tabs)");
    }
  }, [
    authUser,
    authLoading,
    segments,
    router,
  ]);

  if (authLoading) {
    return null;
  }

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LearnLoopProvider>
      <RootNavigator />
    </LearnLoopProvider>
  );
}