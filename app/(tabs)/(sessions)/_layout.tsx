
import { Stack } from "expo-router";

export default function SessionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Sessions",
        contentStyle: {
          backgroundColor: "#F7F8FC",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Sessions",
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "Session Details",
        }}
      />
    </Stack>
  );
}