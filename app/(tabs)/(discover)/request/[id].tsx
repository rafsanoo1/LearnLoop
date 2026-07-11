import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { router, useLocalSearchParams } from "expo-router";
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

export default function RequestSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const skill = SKILL_OFFERS.find((item) => item.id === id);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [mode, setMode] = useState<"Online" | "In Person">("Online");
  const [objective, setObjective] = useState("");

  const [errors, setErrors] = useState({
    date: "",
    time: "",
    objective: "",
  });

  const handleDateChange = (text: string) => {
    setDate(text);

    if (errors.date) {
      setErrors((previous) => ({
        ...previous,
        date: "",
      }));
    }
  };

  const handleTimeChange = (text: string) => {
    setTime(text);

    if (errors.time) {
      setErrors((previous) => ({
        ...previous,
        time: "",
      }));
    }
  };

  const handleObjectiveChange = (text: string) => {
    setObjective(text);

    if (errors.objective) {
      setErrors((previous) => ({
        ...previous,
        objective: "",
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      date: date.trim() ? "" : "Preferred date is required.",
      time: time.trim() ? "" : "Preferred time is required.",
      objective:
        objective.trim().length >= 10
          ? ""
          : "Learning objective must be at least 10 characters.",
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(
      (error) => error === ""
    );

    if (!isValid) {
      return;
    }

    const successMessage =
      "Your session request has been submitted successfully.";

    // Alert button callbacks do not behave consistently on React Native Web.
    if (Platform.OS === "web") {
      window.alert(successMessage);
      router.back();
      return;
    }

    Alert.alert("Request Submitted", successMessage, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  if (!skill) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Skill not found.</Text>
      </View>
    );
  }

  const creditCost = Number(duration) / 60;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Request Session</Text>
      <Text style={styles.skillTitle}>{skill.title}</Text>

      <Text style={styles.label}>Preferred Date</Text>

      <TextInput
        style={[
          styles.input,
          errors.date ? styles.inputError : null,
        ]}
        value={date}
        onChangeText={handleDateChange}
        placeholder="e.g. 20 July 2026"
        placeholderTextColor={COLORS.textLight}
      />

      {errors.date ? (
        <Text style={styles.errorText}>{errors.date}</Text>
      ) : null}

      <Text style={styles.label}>Preferred Time</Text>

      <TextInput
        style={[
          styles.input,
          errors.time ? styles.inputError : null,
        ]}
        value={time}
        onChangeText={handleTimeChange}
        placeholder="e.g. 3:00 PM"
        placeholderTextColor={COLORS.textLight}
      />

      {errors.time ? (
        <Text style={styles.errorText}>{errors.time}</Text>
      ) : null}

      <Text style={styles.label}>Duration</Text>

      <View style={styles.optionRow}>
        {["30", "60", "90"].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.optionButton,
              duration === item && styles.optionButtonActive,
            ]}
            onPress={() => setDuration(item)}
          >
            <Text
              style={[
                styles.optionText,
                duration === item && styles.optionTextActive,
              ]}
            >
              {item} min
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Session Mode</Text>

      <View style={styles.optionRow}>
        {(["Online", "In Person"] as const).map((item) => (
          <Pressable
            key={item}
            style={[
              styles.optionButton,
              mode === item && styles.optionButtonActive,
            ]}
            onPress={() => setMode(item)}
          >
            <Text
              style={[
                styles.optionText,
                mode === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Learning Objective</Text>

      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          errors.objective ? styles.inputError : null,
        ]}
        value={objective}
        onChangeText={handleObjectiveChange}
        placeholder="What would you like to learn in this session?"
        placeholderTextColor={COLORS.textLight}
        multiline
        maxLength={200}
      />

      <Text style={styles.counter}>
        {objective.length} / 200 characters
      </Text>

      {errors.objective ? (
        <Text style={styles.errorText}>{errors.objective}</Text>
      ) : null}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Request Summary</Text>

        <Text style={styles.summaryText}>
          Duration: {duration} minutes
        </Text>

        <Text style={styles.summaryText}>Mode: {mode}</Text>

        <Text style={styles.summaryText}>
          Credit cost: {creditCost}{" "}
          {creditCost === 1 ? "credit" : "credits"}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },

  skillTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: SPACING.lg,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginBottom: SPACING.md,
  },

  counter: {
    color: COLORS.textLight,
    fontSize: 11,
    textAlign: "right",
    marginBottom: SPACING.xs,
  },

  optionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  optionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  optionTextActive: {
    color: COLORS.white,
  },

  summaryCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.lg,
  },

  summaryTitle: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },

  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
  },

  submitButtonPressed: {
    opacity: 0.8,
  },

  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  notFoundText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});