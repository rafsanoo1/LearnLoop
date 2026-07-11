import { Stack } from "expo-router";

export default function TeachLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Teach" }} />
    </Stack>
  );
}