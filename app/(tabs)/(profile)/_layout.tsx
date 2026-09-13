
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#F7F8FC",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
        }}
      />

      <Stack.Screen
        name="credit-history"
        options={{
          title: "Credit History",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  );
}