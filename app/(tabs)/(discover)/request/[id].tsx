import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";
import { useLearnLoop } from "@/context/LearnLoopContext";
import { createSession } from "@/services/sessionService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import React, {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
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

export default function RequestSessionScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    state: {
      selectedSkill,
      selectedSkillLoading,
      selectedSkillError,
    },
    loadSkillById,
  } = useLearnLoop();

  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [time, setTime] = useState("");
  const [duration, setDuration] =
    useState("60");

  const [mode, setMode] = useState<
    "Online" | "In Person"
  >("Online");

  const [objective, setObjective] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [errors, setErrors] = useState({
    date: "",
    time: "",
    objective: "",
  });

  useEffect(() => {
    if (id) {
      void loadSkillById(id);
    }
  }, [id]);

  useEffect(() => {
    if (!selectedSkill) {
      return;
    }

    if (
      selectedSkill.mode === "In Person"
    ) {
      setMode("In Person");
    } else {
      setMode("Online");
    }

    setDuration(
      String(
        selectedSkill.duration || 60
      )
    );
  }, [selectedSkill]);

  const formatDate = (
    value: Date
  ) => {
    const year =
      value.getFullYear();

    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      value.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getToday = () => {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return today;
  };

  const getTodayString = () => {
    return formatDate(getToday());
  };

  const isValidDateString = (
    value: string
  ) => {
    const match =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        value
      );

    if (!match) {
      return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const parsedDate = new Date(
      year,
      month - 1,
      day
    );

    parsedDate.setHours(
      0,
      0,
      0,
      0
    );

    return (
      parsedDate.getFullYear() ===
        year &&
      parsedDate.getMonth() ===
        month - 1 &&
      parsedDate.getDate() === day
    );
  };

  const isPastDate = (
    value: string
  ) => {
    if (!isValidDateString(value)) {
      return false;
    }

    const [
      year,
      month,
      day,
    ] = value
      .split("-")
      .map(Number);

    const chosenDate = new Date(
      year,
      month - 1,
      day
    );

    chosenDate.setHours(
      0,
      0,
      0,
      0
    );

    return (
      chosenDate < getToday()
    );
  };

  const handleNativeDateChange = (
    event: DateTimePickerEvent,
    value?: Date
  ) => {
    if (
      Platform.OS === "android"
    ) {
      setShowDatePicker(false);
    }

    if (
      event.type === "dismissed" ||
      !value
    ) {
      return;
    }

    value.setHours(
      0,
      0,
      0,
      0
    );

    setSelectedDate(value);
    setDate(formatDate(value));

    if (errors.date) {
      setErrors((previous) => ({
        ...previous,
        date: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleWebDateChange = (
    event: any
  ) => {
    const value =
      event.target.value;

    setDate(value);

    if (value) {
      const [
        year,
        month,
        day,
      ] = value
        .split("-")
        .map(Number);

      const parsedDate =
        new Date(
          year,
          month - 1,
          day
        );

      parsedDate.setHours(
        0,
        0,
        0,
        0
      );

      setSelectedDate(
        parsedDate
      );
    } else {
      setSelectedDate(null);
    }

    if (errors.date) {
      setErrors((previous) => ({
        ...previous,
        date: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleTimeChange = (
    text: string
  ) => {
    setTime(text);

    if (errors.time) {
      setErrors((previous) => ({
        ...previous,
        time: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleObjectiveChange = (
    text: string
  ) => {
    setObjective(text);

    if (errors.objective) {
      setErrors((previous) => ({
        ...previous,
        objective: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    let dateError = "";

    if (!date.trim()) {
      dateError =
        "Preferred date is required.";
    } else if (
      !isValidDateString(
        date.trim()
      )
    ) {
      dateError =
        "Please select a valid date.";
    } else if (
      isPastDate(date.trim())
    ) {
      dateError =
        "Preferred date cannot be in the past.";
    }

    const newErrors = {
      date: dateError,

      time: time.trim()
        ? ""
        : "Preferred time is required.",

      objective:
        objective.trim()
          .length >= 10
          ? ""
          : "Learning objective must be at least 10 characters.",
    };

    setErrors(newErrors);

    return Object.values(
      newErrors
    ).every(
      (error) => error === ""
    );
  };

  const handleSubmit =
    async () => {
      if (
        !selectedSkill ||
        !id
      ) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError("");

      try {
        const numericDuration =
          Number(duration);

        const creditCost =
          numericDuration / 60;

        await createSession({
          skillOfferId: id,
          learnerId: "u1",
          scheduledDate:
            date.trim(),
          scheduledTime:
            time.trim(),
          duration:
            numericDuration,
          creditCost,
          objective:
            objective.trim(),
          mode,
        });

        const successMessage =
          "Your session request has been submitted successfully.";

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            successMessage
          );

          router.back();

          return;
        }

        Alert.alert(
          "Request Submitted",
          successMessage,
          [
            {
              text: "OK",
              onPress: () =>
                router.back(),
            },
          ]
        );
      } catch (error) {
        console.error(
          "Session request failed:",
          error
        );

        setSubmitError(
          "Unable to submit your session request. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  if (!id) {
    return (
      <SafeAreaView
        style={
          styles.stateScreen
        }
      >
        <Ionicons
          name="alert-circle-outline"
          size={46}
          color={COLORS.danger}
        />

        <Text
          style={styles.stateTitle}
        >
          Invalid skill
        </Text>

        <Text
          style={
            styles.stateMessage
          }
        >
          No valid skill ID was
          provided.
        </Text>

        <Pressable
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (selectedSkillLoading) {
    return (
      <SafeAreaView
        style={
          styles.stateScreen
        }
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text
          style={styles.stateTitle}
        >
          Loading skill...
        </Text>

        <Text
          style={
            styles.stateMessage
          }
        >
          Please wait while
          LearnLoop prepares your
          session request.
        </Text>
      </SafeAreaView>
    );
  }

  if (selectedSkillError) {
    return (
      <SafeAreaView
        style={
          styles.stateScreen
        }
      >
        <Ionicons
          name="alert-circle-outline"
          size={46}
          color={COLORS.danger}
        />

        <Text
          style={styles.stateTitle}
        >
          Unable to load skill
        </Text>

        <Text
          style={
            styles.stateMessage
          }
        >
          {selectedSkillError}
        </Text>

        <Pressable
          style={
            styles.retryButton
          }
          onPress={() => {
            void loadSkillById(
              id
            );
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry loading skill"
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={COLORS.white}
          />

          <Text
            style={
              styles.retryButtonText
            }
          >
            Try Again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!selectedSkill) {
    return (
      <SafeAreaView
        style={
          styles.stateScreen
        }
      >
        <Ionicons
          name="school-outline"
          size={46}
          color={
            COLORS.textLight
          }
        />

        <Text
          style={styles.stateTitle}
        >
          Skill not found
        </Text>

        <Text
          style={
            styles.stateMessage
          }
        >
          The selected skill could
          not be found.
        </Text>

        <Pressable
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
          accessibilityRole="button"
          accessibilityLabel="Go back to skill details"
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const skill =
    selectedSkill;

  const creditCost =
    Number(duration) / 60;

  const availableModes: (
    | "Online"
    | "In Person"
  )[] =
    skill.mode === "Both"
      ? [
          "Online",
          "In Person",
        ]
      : [skill.mode];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text
        style={styles.heading}
      >
        Request Session
      </Text>

      <Text
        style={styles.skillTitle}
      >
        {skill.title}
      </Text>

      <View
        style={
          styles.skillSummary
        }
      >
        <View
          style={
            styles.skillSummaryRow
          }
        >
          <Ionicons
            name="time-outline"
            size={17}
            color={COLORS.primary}
          />

          <Text
            style={
              styles.skillSummaryText
            }
          >
            Standard duration:{" "}
            {skill.duration} minutes
          </Text>
        </View>

        <View
          style={
            styles.skillSummaryRow
          }
        >
          <Ionicons
            name="location-outline"
            size={17}
            color={COLORS.primary}
          />

          <Text
            style={
              styles.skillSummaryText
            }
          >
            Mode: {skill.mode}
          </Text>
        </View>
      </View>

      <Text
        style={styles.label}
      >
        Preferred Date
      </Text>

      {Platform.OS ===
      "web" ? (
        <View
          style={[
            styles.webDateContainer,
            errors.date
              ? styles.inputError
              : null,
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={19}
            color={COLORS.primary}
          />

          {React.createElement(
            "input",
            {
              type: "date",
              value: date,
              min: getTodayString(),
              onChange:
                handleWebDateChange,
              "aria-label":
                "Preferred session date",
              style: {
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor:
                  "transparent",
                fontSize: 14,
                color:
                  COLORS.textPrimary,
                fontFamily:
                  "inherit",
                width: "100%",
              },
            }
          )}
        </View>
      ) : (
        <>
          <Pressable
            style={[
              styles.dateButton,
              errors.date
                ? styles.inputError
                : null,
            ]}
            onPress={() =>
              setShowDatePicker(
                true
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Select preferred session date"
          >
            <Ionicons
              name="calendar-outline"
              size={19}
              color={
                COLORS.primary
              }
            />

            <Text
              style={[
                styles.dateButtonText,
                !date
                  ? styles.datePlaceholder
                  : null,
              ]}
            >
              {date ||
                "Select a date"}
            </Text>
          </Pressable>

          {showDatePicker ? (
            <DateTimePicker
              value={
                selectedDate ??
                getToday()
              }
              mode="date"
              display="default"
              minimumDate={
                getToday()
              }
              onChange={
                handleNativeDateChange
              }
            />
          ) : null}
        </>
      )}

      {errors.date ? (
        <Text
          style={styles.errorText}
        >
          {errors.date}
        </Text>
      ) : null}

      <Text
        style={styles.label}
      >
        Preferred Time
      </Text>

      <TextInput
        style={[
          styles.input,
          errors.time
            ? styles.inputError
            : null,
        ]}
        value={time}
        onChangeText={
          handleTimeChange
        }
        placeholder="e.g. 3:00 PM"
        placeholderTextColor={
          COLORS.textLight
        }
        accessibilityLabel="Preferred session time"
      />

      {errors.time ? (
        <Text
          style={styles.errorText}
        >
          {errors.time}
        </Text>
      ) : null}

      <Text
        style={styles.label}
      >
        Duration
      </Text>

      <View
        style={styles.optionRow}
      >
        {[
          "30",
          "60",
          "90",
        ].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.optionButton,
              duration === item
                ? styles.optionButtonActive
                : null,
            ]}
            onPress={() =>
              setDuration(item)
            }
            accessibilityRole="button"
            accessibilityLabel={`Select ${item} minute session`}
            accessibilityState={{
              selected:
                duration ===
                item,
            }}
          >
            <Text
              style={[
                styles.optionText,
                duration ===
                item
                  ? styles.optionTextActive
                  : null,
              ]}
            >
              {item} min
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={styles.label}
      >
        Session Mode
      </Text>

      <View
        style={styles.optionRow}
      >
        {availableModes.map(
          (item) => (
            <Pressable
              key={item}
              style={[
                styles.optionButton,
                mode === item
                  ? styles.optionButtonActive
                  : null,
              ]}
              onPress={() =>
                setMode(item)
              }
              accessibilityRole="button"
              accessibilityLabel={`Select ${item} session mode`}
              accessibilityState={{
                selected:
                  mode === item,
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  mode === item
                    ? styles.optionTextActive
                    : null,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <Text
        style={styles.label}
      >
        Learning Objective
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          errors.objective
            ? styles.inputError
            : null,
        ]}
        value={objective}
        onChangeText={
          handleObjectiveChange
        }
        placeholder="What would you like to learn in this session?"
        placeholderTextColor={
          COLORS.textLight
        }
        multiline
        maxLength={200}
        textAlignVertical="top"
        accessibilityLabel="Learning objective"
      />

      <Text
        style={styles.counter}
      >
        {objective.length} / 200
        characters
      </Text>

      {errors.objective ? (
        <Text
          style={styles.errorText}
        >
          {errors.objective}
        </Text>
      ) : null}

      <View
        style={
          styles.summaryCard
        }
      >
        <Text
          style={
            styles.summaryTitle
          }
        >
          Request Summary
        </Text>

        <Text
          style={
            styles.summaryText
          }
        >
          Skill: {skill.title}
        </Text>

        <Text
          style={
            styles.summaryText
          }
        >
          Date:{" "}
          {date ||
            "Not selected"}
        </Text>

        <Text
          style={
            styles.summaryText
          }
        >
          Duration: {duration}{" "}
          minutes
        </Text>

        <Text
          style={
            styles.summaryText
          }
        >
          Mode: {mode}
        </Text>

        <Text
          style={
            styles.summaryText
          }
        >
          Credit cost:{" "}
          {creditCost}{" "}
          {creditCost === 1
            ? "credit"
            : "credits"}
        </Text>
      </View>

      {submitError ? (
        <View
          style={
            styles.submitErrorCard
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={COLORS.danger}
          />

          <Text
            style={
              styles.submitErrorText
            }
          >
            {submitError}
          </Text>
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          isSubmitting
            ? styles.submitButtonDisabled
            : null,
          pressed &&
          !isSubmitting
            ? styles.submitButtonPressed
            : null,
        ]}
        onPress={() => {
          void handleSubmit();
        }}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Submit session request"
        accessibilityState={{
          disabled:
            isSubmitting,
        }}
      >
        {isSubmitting ? (
          <>
            <ActivityIndicator
              size="small"
              color={COLORS.white}
            />

            <Text
              style={
                styles.submitButtonText
              }
            >
              Submitting...
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="send-outline"
              size={18}
              color={COLORS.white}
            />

            <Text
              style={
                styles.submitButtonText
              }
            >
              Submit Request
            </Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: SPACING.lg,
      paddingBottom:
        SPACING.xl,
    },

    heading: {
      color:
        COLORS.textPrimary,
      fontSize: 24,
      fontWeight: "800",
      marginBottom:
        SPACING.xs,
    },

    skillTitle: {
      color: COLORS.primary,
      fontSize: 14,
      fontWeight: "600",
      marginBottom:
        SPACING.md,
    },

    skillSummary: {
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.md,
      padding: SPACING.md,
      marginBottom:
        SPACING.lg,
      gap: SPACING.sm,
    },

    skillSummaryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },

    skillSummaryText: {
      color:
        COLORS.textSecondary,
      fontSize: 12,
    },

    label: {
      color:
        COLORS.textPrimary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom:
        SPACING.sm,
    },

    input: {
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.md,
      paddingHorizontal:
        SPACING.md,
      paddingVertical: 12,
      color:
        COLORS.textPrimary,
      fontSize: 14,
      marginBottom:
        SPACING.xs,
    },

    webDateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.md,
      paddingHorizontal:
        SPACING.md,
      minHeight: 48,
      marginBottom:
        SPACING.xs,
    },

    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.md,
      paddingHorizontal:
        SPACING.md,
      paddingVertical: 13,
      marginBottom:
        SPACING.xs,
    },

    dateButtonText: {
      color:
        COLORS.textPrimary,
      fontSize: 14,
    },

    datePlaceholder: {
      color:
        COLORS.textLight,
    },

    multilineInput: {
      minHeight: 100,
      textAlignVertical:
        "top",
    },

    inputError: {
      borderColor:
        COLORS.danger,
    },

    errorText: {
      color: COLORS.danger,
      fontSize: 11,
      marginBottom:
        SPACING.md,
    },

    counter: {
      color:
        COLORS.textLight,
      fontSize: 11,
      textAlign: "right",
      marginBottom:
        SPACING.xs,
    },

    optionRow: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginBottom:
        SPACING.lg,
    },

    optionButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 11,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.md,
      backgroundColor:
        COLORS.surface,
    },

    optionButtonActive: {
      backgroundColor:
        COLORS.primary,
      borderColor:
        COLORS.primary,
    },

    optionText: {
      color:
        COLORS.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },

    optionTextActive: {
      color: COLORS.white,
    },

    summaryCard: {
      backgroundColor:
        COLORS.primaryLight,
      borderRadius:
        RADIUS.md,
      padding: SPACING.md,
      marginVertical:
        SPACING.lg,
    },

    summaryTitle: {
      color:
        COLORS.primaryDark,
      fontSize: 14,
      fontWeight: "700",
      marginBottom:
        SPACING.sm,
    },

    summaryText: {
      color:
        COLORS.textSecondary,
      fontSize: 12,
      marginBottom:
        SPACING.xs,
    },

    submitErrorCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.danger,
      borderRadius:
        RADIUS.md,
      padding: SPACING.md,
      marginBottom:
        SPACING.md,
    },

    submitErrorText: {
      flex: 1,
      color: COLORS.danger,
      fontSize: 12,
      lineHeight: 18,
    },

    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: SPACING.sm,
      backgroundColor:
        COLORS.primary,
      borderRadius:
        RADIUS.md,
      paddingVertical: 15,
    },

    submitButtonPressed: {
      opacity: 0.8,
    },

    submitButtonDisabled: {
      opacity: 0.65,
    },

    submitButtonText: {
      color: COLORS.white,
      fontSize: 15,
      fontWeight: "700",
    },

    stateScreen: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        COLORS.background,
      padding: SPACING.xl,
    },

    stateTitle: {
      color:
        COLORS.textPrimary,
      fontSize: 18,
      fontWeight: "700",
      marginTop:
        SPACING.md,
      textAlign: "center",
    },

    stateMessage: {
      color:
        COLORS.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      marginTop:
        SPACING.sm,
    },

    retryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: SPACING.sm,
      backgroundColor:
        COLORS.primary,
      borderRadius:
        RADIUS.md,
      paddingHorizontal:
        SPACING.lg,
      paddingVertical: 12,
      marginTop:
        SPACING.lg,
    },

    retryButtonText: {
      color: COLORS.white,
      fontSize: 13,
      fontWeight: "700",
    },

    backButton: {
      backgroundColor:
        COLORS.primaryLight,
      borderRadius:
        RADIUS.md,
      paddingHorizontal:
        SPACING.lg,
      paddingVertical: 12,
      marginTop:
        SPACING.lg,
    },

    backButtonText: {
      color:
        COLORS.primary,
      fontSize: 13,
      fontWeight: "700",
    },
  });