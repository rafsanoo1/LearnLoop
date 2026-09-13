import { LearnLoopProvider } from "@/context/LearnLoopContext";
import { COLORS } from "@/constants/learnloop-theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <LearnLoopProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
          },
        }}
      >
        <Tabs.Screen
          name="(discover)"
          options={{
            title: "Discover",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="search-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(teach)"
          options={{
            title: "Teach",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="school-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(sessions)"
          options={{
            title: "Sessions",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="calendar-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="explore"
          options={{ href: null }}
        />
      </Tabs>
    </LearnLoopProvider>
  );
}