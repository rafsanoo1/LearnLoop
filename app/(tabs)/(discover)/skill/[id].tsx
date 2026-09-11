import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";
import { useLearnLoop } from "@/context/LearnLoopContext";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SkillDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    state: {
      selectedSkill,
      selectedSkillLoading,
      selectedSkillError,
      users,
      userLoading,
    },
    loadSkillById,
    clearSelectedSkill,
    loadUserById,
  } = useLearnLoop();

  useEffect(() => {
    if (id) {
      void loadSkillById(id);
    }

    return () => {
      clearSelectedSkill();
    };
  }, [id]);

  useEffect(() => {
    if (selectedSkill?.mentorId) {
      void loadUserById(
        selectedSkill.mentorId
      );
    }
  }, [selectedSkill?.mentorId]);

  const mentor = selectedSkill
    ? users[selectedSkill.mentorId]
    : undefined;

  const getMentorInitials = () => {
    const name =
      mentor?.name ?? "Unknown Mentor";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (!id) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
      >
        <Ionicons
          name="alert-circle-outline"
          size={46}
          color={COLORS.danger}
        />

        <Text style={styles.stateTitle}>
          Invalid skill
        </Text>

        <Text style={styles.stateMessage}>
          No valid skill ID was provided.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text
            style={styles.backButtonText}
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
        style={styles.stateScreen}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.stateTitle}>
          Loading skill...
        </Text>

        <Text style={styles.stateMessage}>
          Please wait while LearnLoop
          loads the skill details.
        </Text>
      </SafeAreaView>
    );
  }

  if (selectedSkillError) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
      >
        <Ionicons
          name="alert-circle-outline"
          size={46}
          color={COLORS.danger}
        />

        <Text style={styles.stateTitle}>
          Unable to load skill
        </Text>

        <Text style={styles.stateMessage}>
          {selectedSkillError}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            void loadSkillById(id);
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry loading skill details"
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={COLORS.white}
          />

          <Text
            style={styles.retryButtonText}
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
        style={styles.stateScreen}
      >
        <Ionicons
          name="school-outline"
          size={46}
          color={COLORS.textLight}
        />

        <Text style={styles.stateTitle}>
          Skill not found
        </Text>

        <Text style={styles.stateMessage}>
          This skill could not be found.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back to discover"
        >
          <Text
            style={styles.backButtonText}
          >
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const skill = selectedSkill;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>
          {skill.category}
        </Text>
      </View>

      <Text style={styles.title}>
        {skill.title}
      </Text>

      <View style={styles.ratingRow}>
        <Ionicons
          name="star"
          size={17}
          color={COLORS.warning}
        />

        <Text style={styles.ratingText}>
          {skill.rating}
        </Text>
      </View>

      <View style={styles.mentorCard}>
        {userLoading && !mentor ? (
          <View
            style={
              styles.mentorLoadingContainer
            }
          >
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
            />

            <Text
              style={styles.mentorLoadingText}
            >
              Loading mentor...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.avatar}>
              <Text
                style={styles.avatarText}
              >
                {getMentorInitials()}
              </Text>
            </View>

            <View
              style={styles.mentorInfo}
            >
              <Text
                style={styles.mentorLabel}
              >
                Mentor
              </Text>

              <Text
                style={styles.mentorName}
              >
                {mentor?.name ??
                  "Unknown Mentor"}
              </Text>

              {mentor?.department ? (
                <Text
                  style={
                    styles.mentorDepartment
                  }
                >
                  {mentor.department}
                </Text>
              ) : null}

              {mentor?.semester ? (
                <Text
                  style={
                    styles.mentorSemester
                  }
                >
                  {mentor.semester} semester
                </Text>
              ) : null}
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        About this skill
      </Text>

      <Text style={styles.description}>
        {skill.description}
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Level
          </Text>

          <Text style={styles.infoValue}>
            {skill.level}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Duration
          </Text>

          <Text style={styles.infoValue}>
            {skill.duration} minutes
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Mode
          </Text>

          <Text style={styles.infoValue}>
            {skill.mode}
          </Text>
        </View>

        {skill.location ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Location
            </Text>

            <Text style={styles.infoValue}>
              {skill.location}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>
        Available days
      </Text>

      {skill.availableDays.length > 0 ? (
        <View style={styles.daysContainer}>
          {skill.availableDays.map(
            (day) => (
              <View
                key={day}
                style={styles.dayBadge}
              >
                <Text
                  style={styles.dayText}
                >
                  {day}
                </Text>
              </View>
            )
          )}
        </View>
      ) : (
        <Text style={styles.noDaysText}>
          No availability information
          provided.
        </Text>
      )}

      <Pressable
        style={styles.requestButton}
        onPress={() =>
          router.push({
            pathname:
              "/(tabs)/(discover)/request/[id]",
            params: {
              id: skill.id,
            },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`Request a session for ${skill.title}`}
      >
        <Ionicons
          name="calendar-outline"
          size={19}
          color={COLORS.white}
        />

        <Text
          style={styles.requestButtonText}
        >
          Request Session
        </Text>
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

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor:
      COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },

  categoryText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: SPACING.sm,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: SPACING.lg,
  },

  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  mentorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  mentorLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },

  mentorLoadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  mentorInfo: {
    flex: 1,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  mentorLabel: {
    color: COLORS.textLight,
    fontSize: 11,
  },

  mentorName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  mentorDepartment: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  mentorSemester: {
    color: COLORS.textLight,
    fontSize: 11,
    marginTop: 2,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },

  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },

  dayBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  dayText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  noDaysText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.xl,
  },

  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
  },

  requestButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  stateScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },

  stateTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: SPACING.md,
    textAlign: "center",
  },

  stateMessage: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: SPACING.sm,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    marginTop: SPACING.lg,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  backButton: {
    backgroundColor:
      COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    marginTop: SPACING.lg,
  },

  backButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});