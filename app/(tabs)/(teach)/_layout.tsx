import { COLORS } from "@/constants/learnloop-theme";
import { Stack } from "expo-router";

export default function TeachLayout() {
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
      <Stack.Screen name="index" options={{ title: "Teach" }} />
      
      <Stack.Screen
        name="create"
        options={{ title: "Create Skill Offer" }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{ title: "Edit Skill Offer" }}
      />

      <Stack.Screen
        name="incoming-requests"
        options={{ title: "Incoming Requests" }}
      />

    </Stack>
  );
}