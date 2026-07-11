
import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { router } from "expo-router";
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

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const DURATIONS = ["30", "60", "90"];
const MODES = ["Online", "In Person", "Both"] as const;
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CreateOfferScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] =
    useState<(typeof LEVELS)[number]>("Beginner");
  const [duration, setDuration] = useState("60");
  const [mode, setMode] =
    useState<(typeof MODES)[number]>("Online");
  const [location, setLocation] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    availableDays: "",
  });

  const toggleDay = (day: string) => {
    setAvailableDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  const handleSubmit = () => {
    const newErrors = {
      title:
        title.trim().length >= 3
          ? ""
          : "Title must contain at least 3 characters.",
      category: category.trim() ? "" : "Category is required.",
      description:
        description.trim().length >= 20
          ? ""
          : "Description must contain at least 20 characters.",
      location:
        mode !== "Online" && !location.trim()
          ? "Location is required for in-person sessions."
          : "",
      availableDays:
        availableDays.length > 0
          ? ""
          : "Select at least one available day.",
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(
      (error) => error === ""
    );

    if (!isValid) return;

    const message = "Your skill offer was created successfully.";

    if (Platform.OS === "web") {
      window.alert(message);
      router.back();
      return;
    }

    Alert.alert("Offer Created", message, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Create Skill Offer</Text>
      <Text style={styles.subtitle}>
        Share a skill and earn Skill Credits by teaching other students.
      </Text>

      <Text style={styles.label}>Skill Title</Text>
      <TextInput
        style={[styles.input, errors.title ? styles.inputError : null]}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. React Native for Beginners"
        placeholderTextColor={COLORS.textLight}
      />
      {errors.title ? (
        <Text style={styles.errorText}>{errors.title}</Text>
      ) : null}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[
          styles.input,
          errors.category ? styles.inputError : null,
        ]}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. Programming"
        placeholderTextColor={COLORS.textLight}
      />
      {errors.category ? (
        <Text style={styles.errorText}>{errors.category}</Text>
      ) : null}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          errors.description ? styles.inputError : null,
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe what students will learn..."
        placeholderTextColor={COLORS.textLight}
        multiline
        maxLength={300}
      />
      <Text style={styles.counter}>
        {description.length} / 300 characters
      </Text>
      {errors.description ? (
        <Text style={styles.errorText}>{errors.description}</Text>
      ) : null}

      <Text style={styles.label}>Difficulty Level</Text>
      <View style={styles.optionRow}>
        {LEVELS.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.optionButton,
              level === item && styles.optionButtonActive,
            ]}
            onPress={() => setLevel(item)}
          >
            <Text
              style={[
                styles.optionText,
                level === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Session Duration</Text>
      <View style={styles.optionRow}>
        {DURATIONS.map((item) => (
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
        {MODES.map((item) => (
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

      {mode !== "Online" ? (
        <>
          <Text style={styles.label}>Meeting Location</Text>
          <TextInput
            style={[
              styles.input,
              errors.location ? styles.inputError : null,
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. AIUB Library"
            placeholderTextColor={COLORS.textLight}
          />
          {errors.location ? (
            <Text style={styles.errorText}>{errors.location}</Text>
          ) : null}
        </>
      ) : null}

      <Text style={styles.label}>Available Days</Text>
      <View style={styles.daysContainer}>
        {DAYS.map((day) => {
          const selected = availableDays.includes(day);

          return (
            <Pressable
              key={day}
              style={[
                styles.dayButton,
                selected && styles.dayButtonActive,
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  selected && styles.dayTextActive,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {errors.availableDays ? (
        <Text style={styles.errorText}>{errors.availableDays}</Text>
      ) : null}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Offer</Text>
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
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
    marginBottom: SPACING.md,
  },
  optionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  optionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  optionTextActive: {
    color: COLORS.white,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  dayButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  dayTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});