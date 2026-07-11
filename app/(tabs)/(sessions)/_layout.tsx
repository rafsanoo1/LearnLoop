import { Stack } from "expo-router";

export default function SessionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sessions" }} />
    </Stack>
  );
}