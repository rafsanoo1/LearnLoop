import { COLORS } from "@/constants/learnloop-theme";
import { useLearnLoop } from "@/context/LearnLoopContext";
import { createSession } from "@/services/sessionService";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
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
  const router = useRouter();

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();


  const {
    state: {
      selectedSkill,
      selectedSkillLoading,
      selectedSkillError,
      currentUser,
      currentUserLoading,
      currentUserError,
    },

    loadSkillById,
    loadCurrentUser,
  } = useLearnLoop();


  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [objective, setObjective] =
    useState("");

  const [mode, setMode] =
    useState<"Online" | "In Person">(
      "Online"
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");


  /*
   * Load the selected real skill and
   * the real current user.
   */
  useEffect(() => {
    if (id) {
      void loadSkillById(id);
    }

    void loadCurrentUser();
  }, [id]);


  /*
   * Use the skill's default duration
   * when available.
   */
  useEffect(() => {
    if (
      selectedSkill &&
      !duration
    ) {
      setDuration(
        String(selectedSkill.duration)
      );
    }
  }, [selectedSkill]);


  /*
   * Calculate the credit cost.
   *
   * LearnLoop uses 1 credit for a
   * 60-minute session.
   */
  const numericDuration =
    Number(duration);


  const creditCost = useMemo(() => {
    if (
      !numericDuration ||
      numericDuration <= 0
    ) {
      return 0;
    }

    return numericDuration / 60;
  }, [numericDuration]);


  const submitRequest = async () => {
    setSubmitError("");


    if (!selectedSkill || !id) {
      setSubmitError(
        "Unable to identify the selected skill."
      );
      return;
    }


    if (!currentUser) {
      setSubmitError(
        "Unable to identify the current user. Please try again."
      );
      return;
    }


    if (!date.trim()) {
      setSubmitError(
        "Please enter a session date."
      );
      return;
    }


    if (!time.trim()) {
      setSubmitError(
        "Please enter a session time."
      );
      return;
    }


    if (
      !numericDuration ||
      numericDuration <= 0
    ) {
      setSubmitError(
        "Please enter a valid duration."
      );
      return;
    }


    if (!objective.trim()) {
      setSubmitError(
        "Please enter your learning objective."
      );
      return;
    }


    /*
     * Prevent a user from requesting
     * their own skill.
     */
    if (
      selectedSkill.mentorId ===
      currentUser.id
    ) {
      setSubmitError(
        "You cannot request a session for your own skill."
      );
      return;
    }


    try {
      setIsSubmitting(true);


      /*
       * This creates a REAL session in
       * MongoDB through POST /api/sessions.
       *
       * The backend determines mentorId
       * from the selected skill.
       */
      await createSession({
        skillOfferId: id,

        learnerId:
          currentUser.id,

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
        "Your session request has been submitted.";


      if (Platform.OS === "web") {
        window.alert(successMessage);

        router.replace(
          "/(tabs)/(sessions)" as any
        );
      } else {
        Alert.alert(
          "Request Submitted",
          successMessage,
          [
            {
              text: "View Sessions",
              onPress: () =>
                router.replace(
                  "/(tabs)/(sessions)" as any
                ),
            },
          ]
        );
      }

    } catch (error) {
      console.error(
        "Create session error:",
        error
      );


      setSubmitError(
        "Failed to create the session request. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };


  /*
   * Loading state
   */
  if (
    selectedSkillLoading ||
    currentUserLoading
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading request details...
        </Text>
      </View>
    );
  }


  /*
   * Skill loading error
   */
  if (
    selectedSkillError ||
    !selectedSkill
  ) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Request Session",
          }}
        />

        <View style={styles.center}>

          <Text style={styles.errorTitle}>
            Unable to load skill
          </Text>

          <Text style={styles.errorText}>
            {selectedSkillError ??
              "The selected skill could not be found."}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backButtonText}
            >
              Go Back
            </Text>
          </Pressable>

        </View>
      </>
    );
  }


  /*
   * Current-user loading error
   */
  if (
    currentUserError ||
    !currentUser
  ) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Request Session",
          }}
        />

        <View style={styles.center}>

          <Text style={styles.errorTitle}>
            Unable to identify user
          </Text>

          <Text style={styles.errorText}>
            {currentUserError ??
              "Your user information could not be loaded."}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backButtonText}
            >
              Go Back
            </Text>
          </Pressable>

        </View>
      </>
    );
  }


  /*
   * Prevent requesting your own skill.
   */
  const isOwnSkill =
    selectedSkill.mentorId ===
    currentUser.id;


  return (
    <>
      <Stack.Screen
        options={{
          title: "Request Session",
        }}
      />


      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* PAGE HEADER */}

        <Text style={styles.heading}>
          Request a Session
        </Text>

        <Text style={styles.description}>
          Book a learning session with this
          mentor.
        </Text>


        {/* SKILL SUMMARY */}

        <View style={styles.skillCard}>

          <Text style={styles.skillTitle}>
            {selectedSkill.title}
          </Text>

          <Text style={styles.skillCategory}>
            {selectedSkill.category}
          </Text>

          <Text style={styles.skillDescription}>
            {selectedSkill.description}
          </Text>

          <View style={styles.skillMetaRow}>

            <Text style={styles.skillMeta}>
              {selectedSkill.duration} min
            </Text>

            <Text style={styles.skillMeta}>
              {selectedSkill.mode}
            </Text>

            <Text style={styles.skillMeta}>
              {selectedSkill.level}
            </Text>

          </View>

        </View>


        {/* OWN SKILL WARNING */}

        {isOwnSkill && (
          <View style={styles.warningBox}>

            <Text style={styles.warningTitle}>
              This is your skill
            </Text>

            <Text style={styles.warningText}>
              You cannot request a learning
              session from your own skill offer.
            </Text>

          </View>
        )}


        {/* DATE */}

        <View style={styles.formSection}>

          <Text style={styles.label}>
            Session Date
          </Text>

          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="e.g. 2026-09-24"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            editable={
              !isSubmitting &&
              !isOwnSkill
            }
          />

          <Text style={styles.helperText}>
            Use YYYY-MM-DD format.
          </Text>

        </View>


        {/* TIME */}

        <View style={styles.formSection}>

          <Text style={styles.label}>
            Session Time
          </Text>

          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="e.g. 3:00 PM"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            editable={
              !isSubmitting &&
              !isOwnSkill
            }
          />

          <Text style={styles.helperText}>
            Enter the preferred starting time.
          </Text>

        </View>


        {/* DURATION */}

        <View style={styles.formSection}>

          <Text style={styles.label}>
            Duration
          </Text>

          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 60"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            style={styles.input}
            editable={
              !isSubmitting &&
              !isOwnSkill
            }
          />

          <Text style={styles.helperText}>
            Duration is measured in minutes.
          </Text>

        </View>


        {/* CREDIT COST */}

        <View style={styles.creditCard}>

          <View>
            <Text style={styles.creditLabel}>
              Credit Cost
            </Text>

            <Text style={styles.creditDescription}>
              Based on the requested duration.
            </Text>
          </View>

          <Text style={styles.creditValue}>
            {creditCost}{" "}
            {creditCost === 1
              ? "credit"
              : "credits"}
          </Text>

        </View>


        {/* MODE */}

        <View style={styles.formSection}>

          <Text style={styles.label}>
            Session Mode
          </Text>

          <View style={styles.modeRow}>

            <Pressable
              style={[
                styles.modeButton,
                mode === "Online" &&
                  styles.activeModeButton,
              ]}
              disabled={
                isSubmitting ||
                isOwnSkill
              }
              onPress={() =>
                setMode("Online")
              }
            >

              <Text
                style={[
                  styles.modeButtonText,
                  mode === "Online" &&
                    styles.activeModeButtonText,
                ]}
              >
                Online
              </Text>

            </Pressable>


            <Pressable
              style={[
                styles.modeButton,
                mode === "In Person" &&
                  styles.activeModeButton,
              ]}
              disabled={
                isSubmitting ||
                isOwnSkill
              }
              onPress={() =>
                setMode("In Person")
              }
            >

              <Text
                style={[
                  styles.modeButtonText,
                  mode === "In Person" &&
                    styles.activeModeButtonText,
                ]}
              >
                In Person
              </Text>

            </Pressable>

          </View>

        </View>


        {/* OBJECTIVE */}

        <View style={styles.formSection}>

          <Text style={styles.label}>
            Learning Objective
          </Text>

          <TextInput
            value={objective}
            onChangeText={setObjective}
            placeholder="What do you want to learn from this session?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.objectiveInput,
            ]}
            editable={
              !isSubmitting &&
              !isOwnSkill
            }
          />

        </View>


        {/* SUBMIT ERROR */}

        {submitError ? (
          <View style={styles.errorBox}>

            <Text style={styles.errorBoxText}>
              {submitError}
            </Text>

          </View>
        ) : null}


        {/* SUBMIT */}

        <Pressable
          style={[
            styles.submitButton,
            (isSubmitting ||
              isOwnSkill) &&
              styles.disabledButton,
          ]}
          disabled={
            isSubmitting ||
            isOwnSkill
          }
          onPress={
            submitRequest
          }
        >

          {isSubmitting ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={styles.submitButtonText}
            >
              Request Session
            </Text>
          )}

        </Pressable>


        {/* CANCEL */}

        <Pressable
          style={styles.cancelButton}
          disabled={isSubmitting}
          onPress={() =>
            router.back()
          }
        >

          <Text
            style={styles.cancelButtonText}
          >
            Cancel
          </Text>

        </Pressable>

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
    maxWidth: 900,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
    padding: 24,
  },

  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 12,
  },

  heading: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  skillCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  skillTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },

  skillCategory: {
    color: "#635BFF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  skillDescription: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },

  skillMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillMeta: {
    color: "#4B5563",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
  },

  warningBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },

  warningTitle: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  warningText: {
    color: "#92400E",
    fontSize: 13,
    lineHeight: 19,
  },

  formSection: {
    marginBottom: 18,
  },

  label: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    minHeight: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#111827",
    fontSize: 14,
  },

  objectiveInput: {
    minHeight: 120,
    paddingTop: 14,
  },

  helperText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 6,
  },

  creditCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },

  creditLabel: {
    color: "#3730A3",
    fontSize: 14,
    fontWeight: "800",
  },

  creditDescription: {
    color: "#6366F1",
    fontSize: 12,
    marginTop: 3,
  },

  creditValue: {
    color: "#4338CA",
    fontSize: 18,
    fontWeight: "800",
  },

  modeRow: {
    flexDirection: "row",
    gap: 10,
  },

  modeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
  },

  activeModeButton: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },

  modeButtonText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },

  activeModeButtonText: {
    color: "#FFFFFF",
  },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
  },

  errorBoxText: {
    color: "#991B1B",
    fontSize: 13,
    lineHeight: 19,
  },

  errorTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },

  errorText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
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
    fontSize: 14,
    fontWeight: "700",
  },

  submitButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.5,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  cancelButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "700",
  },

});