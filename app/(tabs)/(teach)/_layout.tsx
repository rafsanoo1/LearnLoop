import { Stack } from "expo-router";

export default function TeachLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Teach",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Create Skill",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Skill",
        }}
      />

      <Stack.Screen
        name="incoming-requests"
        options={{
          title: "Incoming Requests",
        }}
      />

      <Stack.Screen
        name="requested-skills"
        options={{
          title: "Requested Skills",
        }}
      />
    </Stack>
  );
}