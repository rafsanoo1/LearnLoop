
import { COLORS } from "@/constants/learnloop-theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [sessionRemindersEnabled, setSessionRemindersEnabled] =
    useState(true);

  const [emailUpdatesEnabled, setEmailUpdatesEnabled] =
    useState(false);

  const [darkModeEnabled, setDarkModeEnabled] =
    useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.subheading}>
          Manage your application preferences and account settings.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Notifications
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  Push Notifications
                </Text>

                <Text style={styles.settingDescription}>
                  Receive updates about requests and sessions.
                </Text>
              </View>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
              }}
              thumbColor={
                notificationsEnabled
                  ? COLORS.primary
                  : "#F9FAFB"
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="alarm-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  Session Reminders
                </Text>

                <Text style={styles.settingDescription}>
                  Get reminded before upcoming sessions.
                </Text>
              </View>
            </View>

            <Switch
              value={sessionRemindersEnabled}
              onValueChange={setSessionRemindersEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
              }}
              thumbColor={
                sessionRemindersEnabled
                  ? COLORS.primary
                  : "#F9FAFB"
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  Email Updates
                </Text>

                <Text style={styles.settingDescription}>
                  Receive learning activity updates by email.
                </Text>
              </View>
            </View>

            <Switch
              value={emailUpdatesEnabled}
              onValueChange={setEmailUpdatesEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
              }}
              thumbColor={
                emailUpdatesEnabled
                  ? COLORS.primary
                  : "#F9FAFB"
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Appearance
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="moon-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  Dark Mode
                </Text>

                <Text style={styles.settingDescription}>
                  Toggle the preferred app appearance.
                </Text>
              </View>
            </View>

            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
              }}
              thumbColor={
                darkModeEnabled
                  ? COLORS.primary
                  : "#F9FAFB"
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Account
          </Text>

          <Pressable style={styles.actionRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  Privacy
                </Text>

                <Text style={styles.settingDescription}>
                  Manage account privacy preferences.
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>
                  About LearnLoop
                </Text>

                <Text style={styles.settingDescription}>
                  View application and project information.
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#B91C1C"
          />

          <Text style={styles.logoutText}>
            Log Out
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          LearnLoop Midterm Frontend UI
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 40,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subheading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  section: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  settingTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  settingDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },

  logoutText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
  },

  footerText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },
});