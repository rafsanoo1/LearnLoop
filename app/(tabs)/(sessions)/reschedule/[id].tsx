import { COLORS } from "@/constants/learnloop-theme";
import { SESSIONS } from "@/data/sessions";
import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RescheduleSessionScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const session = SESSIONS.find(
    (item) => item.id === id,
  );

  const [date, setDate] = useState(
    session?.scheduledDate ?? "",
  );

  const [time, setTime] = useState(
    session?.scheduledTime ?? "",
  );

  const [reason, setReason] = useState("");

  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
    reason?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      date?: string;
      time?: string;
      reason?: string;
    } = {};

    if (!date.trim()) {
      newErrors.date = "Preferred date is required.";
    }

    if (!time.trim()) {
      newErrors.time = "Preferred time is required.";
    }

    if (!reason.trim()) {
      newErrors.reason =
        "Please provide a reason for rescheduling.";
    } else if (reason.trim().length < 10) {
      newErrors.reason =
        "Reason must contain at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const message =
      "Reschedule request submitted successfully.";

    if (Platform.OS === "web") {
      window.alert(message);
      router.back();
      return;
    }

    Alert.alert(
      "Request Submitted",
      message,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ],
    );
  };

  if (!session) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen
          options={{
            title: "Reschedule Session",
          }}
        />

        <Ionicons
          name="alert-circle-outline"
          size={54}
          color={COLORS.textSecondary}
        />

        <Text style={styles.notFoundTitle}>
          Session not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reschedule Session",
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="calendar-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.headerInformation}>
            <Text style={styles.heading}>
              Reschedule Session
            </Text>

            <Text style={styles.subheading}>
              Suggest a new date and time for this
              learning session.
            </Text>
          </View>
        </View>

        <View style={styles.currentScheduleCard}>
          <Text style={styles.sectionTitle}>
            Current Schedule
          </Text>

          <View style={styles.scheduleRow}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.scheduleText}>
              {session.scheduledDate}
            </Text>
          </View>

          <View style={styles.scheduleRow}>
            <Ionicons
              name="time-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.scheduleText}>
              {session.scheduledTime}
            </Text>
          </View>

          <View style={styles.scheduleRow}>
            <Ionicons
              name={
                session.mode === "Online"
                  ? "videocam-outline"
                  : "location-outline"
              }
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.scheduleText}>
              {session.mode}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            New Schedule
          </Text>

          <Text style={styles.label}>
            Preferred Date
          </Text>

          <TextInput
            value={date}
            onChangeText={(text) => {
              setDate(text);

              if (errors.date) {
                setErrors((previous) => ({
                  ...previous,
                  date: undefined,
                }));
              }
            }}
            placeholder="e.g. 2026-08-20"
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              errors.date && styles.inputError,
            ]}
          />

          {errors.date ? (
            <Text style={styles.errorText}>
              {errors.date}
            </Text>
          ) : null}

          <Text style={styles.label}>
            Preferred Time
          </Text>

          <TextInput
            value={time}
            onChangeText={(text) => {
              setTime(text);

              if (errors.time) {
                setErrors((previous) => ({
                  ...previous,
                  time: undefined,
                }));
              }
            }}
            placeholder="e.g. 5:00 PM"
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              errors.time && styles.inputError,
            ]}
          />

          {errors.time ? (
            <Text style={styles.errorText}>
              {errors.time}
            </Text>
          ) : null}

          <Text style={styles.label}>
            Reason for Rescheduling
          </Text>

          <TextInput
            value={reason}
            onChangeText={(text) => {
              setReason(text);

              if (errors.reason) {
                setErrors((previous) => ({
                  ...previous,
                  reason: undefined,
                }));
              }
            }}
            placeholder="Explain why you need to reschedule..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={200}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textArea,
              errors.reason && styles.inputError,
            ]}
          />

          <Text style={styles.characterCount}>
            {reason.length}/200 characters
          </Text>

          {errors.reason ? (
            <Text style={styles.errorText}>
              {errors.reason}
            </Text>
          ) : null}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Proposed Schedule
            </Text>

            <Text style={styles.summaryText}>
              Date: {date || "Not selected"}
            </Text>

            <Text style={styles.summaryText}>
              Time: {time || "Not selected"}
            </Text>

            <Text style={styles.summaryText}>
              Duration: {session.duration} minutes
            </Text>

            <Text style={styles.summaryText}>
              Mode: {session.mode}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.submitButtonText}>
                Submit Request
              </Text>
            </Pressable>
          </View>
        </View>

       
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

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  headerIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    marginRight: 14,
  },

  headerInformation: {
    flex: 1,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },

  subheading: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  currentScheduleCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  scheduleText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 13,
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 11,
    marginTop: 5,
  },

  characterCount: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: "right",
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    padding: 15,
    marginTop: 20,
  },

  summaryTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },

  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  submitButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
    padding: 24,
  },

  notFoundTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
 

});