import { COLORS, SPACING } from "@/constants/learnloop-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

const MODES = ["Online", "In Person", "Either"] as const;

export default function RequestSkillScreen() {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] =
    useState<(typeof LEVELS)[number]>("Beginner");
  const [mode, setMode] =
    useState<(typeof MODES)[number]>("Either");
  const [learningGoal, setLearningGoal] = useState("");

  const [errors, setErrors] = useState<{
    skillName?: string;
    category?: string;
    learningGoal?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      skillName?: string;
      category?: string;
      learningGoal?: string;
    } = {};

    if (skillName.trim().length < 3) {
      newErrors.skillName =
        "Skill name must contain at least 3 characters.";
    }

    if (!category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (learningGoal.trim().length < 10) {
      newErrors.learningGoal =
        "Please describe what you want to learn in at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const message =
      "Your skill request has been submitted. We will look for students who can teach this skill.";

    if (Platform.OS === "web") {
      window.alert(message);
      router.back();
      return;
    }

    Alert.alert("Skill Requested", message, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="bulb-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Request a Skill
            </Text>

            <Text style={styles.heroSubtitle}>
              Cannot find what you want to learn? Tell us
              what skill you are looking for.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Skill Name</Text>

          <TextInput
            value={skillName}
            onChangeText={(text) => {
              setSkillName(text);

              if (errors.skillName) {
                setErrors((current) => ({
                  ...current,
                  skillName: undefined,
                }));
              }
            }}
            placeholder="e.g. Adobe Photoshop"
            placeholderTextColor={COLORS.textLight}
            style={[
              styles.input,
              errors.skillName && styles.inputError,
            ]}
            accessibilityLabel="Skill name"
          />

          {errors.skillName ? (
            <Text style={styles.errorText}>
              {errors.skillName}
            </Text>
          ) : null}

          <Text style={styles.label}>Category</Text>

          <TextInput
            value={category}
            onChangeText={(text) => {
              setCategory(text);

              if (errors.category) {
                setErrors((current) => ({
                  ...current,
                  category: undefined,
                }));
              }
            }}
            placeholder="e.g. Design, Programming, Language"
            placeholderTextColor={COLORS.textLight}
            style={[
              styles.input,
              errors.category && styles.inputError,
            ]}
            accessibilityLabel="Skill category"
          />

          {errors.category ? (
            <Text style={styles.errorText}>
              {errors.category}
            </Text>
          ) : null}

          <Text style={styles.label}>
            Preferred Learning Level
          </Text>

          <View style={styles.optionRow}>
            {LEVELS.map((item) => {
              const selected = level === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.optionButton,
                    selected &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() => setLevel(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item} learning level`}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>
            Preferred Session Mode
          </Text>

          <View style={styles.optionRow}>
            {MODES.map((item) => {
              const selected = mode === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.optionButton,
                    selected &&
                      styles.optionButtonSelected,
                  ]}
                  onPress={() => setMode(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item} session mode`}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>
            What do you want to learn?
          </Text>

          <TextInput
            value={learningGoal}
            onChangeText={(text) => {
              setLearningGoal(text);

              if (errors.learningGoal) {
                setErrors((current) => ({
                  ...current,
                  learningGoal: undefined,
                }));
              }
            }}
            placeholder="Describe what you want to learn and what you want to achieve..."
            placeholderTextColor={COLORS.textLight}
            multiline
            maxLength={300}
            textAlignVertical="top"
            style={[
              styles.textArea,
              errors.learningGoal && styles.inputError,
            ]}
            accessibilityLabel="Learning goal"
          />

          <Text style={styles.characterCount}>
            {learningGoal.length}/300 characters
          </Text>

          {errors.learningGoal ? (
            <Text style={styles.errorText}>
              {errors.learningGoal}
            </Text>
          ) : null}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color={COLORS.primary}
            />

            <Text style={styles.summaryTitle}>
              How it works
            </Text>
          </View>

          <Text style={styles.summaryText}>
            Your request will help LearnLoop identify skills
            students want to learn. Students who can teach
            the requested skill can later create matching
            skill offers.
          </Text>
        </View>

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit skill request"
        >
          <Ionicons
            name="send-outline"
            size={19}
            color={COLORS.white}
          />

          <Text style={styles.submitButtonText}>
            Submit Skill Request
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },

  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  textArea: {
    minHeight: 120,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 5,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  optionButton: {
    flexGrow: 1,
    minWidth: 95,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 13,
  },

  optionTextSelected: {
    color: COLORS.white,
  },

  characterCount: {
    textAlign: "right",
    color: COLORS.textLight,
    fontSize: 11,
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  summaryTitle: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: "700",
  },

  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },

  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});