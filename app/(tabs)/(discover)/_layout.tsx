import { COLORS } from "@/constants/learnloop-theme";
import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Discover" }}
      />

      <Stack.Screen
        name="search"
        options={{ title: "Search Skills" }}
      />

      <Stack.Screen
        name="request-skill"
        options={{ title: "Request Skill" }}
      />

      <Stack.Screen
        name="skill/[id]"
        options={{ title: "Skill Details" }}
      />

      <Stack.Screen
        name="request/[id]"
        options={{ title: "Request Session" }}
      />
    </Stack>
  );
}