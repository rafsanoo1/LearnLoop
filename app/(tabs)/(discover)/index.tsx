import SkillCard from "@/components/skill-card";
import {
  COLORS,
  SPACING,
} from "@/constants/learnloop-theme";
import { useLearnLoop } from "@/context/LearnLoopContext";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CURRENT_USER_ID = "u1";

export default function DiscoverScreen() {
  const {
    state: {
      skills,
      skillsLoading,
      skillsError,
      users,
      userLoading,
    },
    loadSkills,
    loadUserById,
  } = useLearnLoop();

  const currentUser =
    users[CURRENT_USER_ID];

  useEffect(() => {
    void loadSkills();
    void loadUserById(
      CURRENT_USER_ID
    );
  }, []);

  useEffect(() => {
    const mentorIds = [
      ...new Set(
        skills.map(
          (skill) => skill.mentorId
        )
      ),
    ];

    mentorIds.forEach((mentorId) => {
      void loadUserById(mentorId);
    });
  }, [skills]);

  const activeSkills = skills.filter(
    (skill) => skill.isActive
  );

  const getMentorName = (
    mentorId: string
  ) => {
    const mentor = users[mentorId];

    if (mentor) {
      return mentor.name;
    }

    if (userLoading) {
      return "Loading Mentor...";
    }

    return "Unknown Mentor";
  };

  const getFirstName = () => {
    if (!currentUser?.name) {
      return "Student";
    }

    return (
      currentUser.name.split(" ")[0] ||
      "Student"
    );
  };

  const handleSkillPress = (
    skill: SkillOffer
  ) => {
    router.push({
      pathname:
        "/(tabs)/(discover)/skill/[id]",
      params: {
        id: skill.id,
      },
    });
  };

  const renderLoadingState = () => (
    <View style={styles.stateContainer}>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
      />

      <Text style={styles.stateTitle}>
        Loading skills...
      </Text>

      <Text style={styles.stateMessage}>
        Please wait while LearnLoop finds
        available skills for you.
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.stateContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={42}
        color={COLORS.danger}
      />

      <Text style={styles.stateTitle}>
        Unable to load skills
      </Text>

      <Text style={styles.stateMessage}>
        {skillsError ??
          "Something went wrong while loading skills."}
      </Text>

      <Pressable
        style={styles.retryButton}
        onPress={() => {
          void loadSkills();
        }}
        accessibilityRole="button"
        accessibilityLabel="Retry loading skills"
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
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.stateContainer}>
      <Ionicons
        name="school-outline"
        size={42}
        color={COLORS.textLight}
      />

      <Text style={styles.stateTitle}>
        No skills available
      </Text>

      <Text style={styles.stateMessage}>
        There are currently no active skill
        offers. You can request a skill you
        want to learn.
      </Text>

      <Pressable
        style={
          styles.emptyRequestButton
        }
        onPress={() =>
          router.push(
            "/(tabs)/(discover)/request-skill"
          )
        }
        accessibilityRole="button"
        accessibilityLabel="Request a skill"
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={COLORS.primary}
        />

        <Text
          style={
            styles.emptyRequestButtonText
          }
        >
          Request Skill
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={activeSkills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillCard
            skill={item}
            mentorName={getMentorName(
              item.mentorId
            )}
            onPress={handleSkillPress}
          />
        )}
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Hello, {getFirstName()} 👋
            </Text>

            <Text style={styles.title}>
              What do you want to learn?
            </Text>

            <View
              style={styles.subtitleRow}
            >
              <Text
                style={styles.subtitle}
              >
                Exchange your time and learn
                from students around campus.
              </Text>

              <Pressable
                style={
                  styles.requestSkillButton
                }
                onPress={() =>
                  router.push(
                    "/(tabs)/(discover)/request-skill"
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Request a new skill"
              >
                <Ionicons
                  name="add-circle-outline"
                  size={17}
                  color={COLORS.primary}
                />

                <Text
                  style={
                    styles.requestSkillButtonText
                  }
                >
                  Request Skill
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.searchButton}
              onPress={() =>
                router.push(
                  "/(tabs)/(discover)/search"
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Search skills or categories"
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={COLORS.textLight}
              />

              <Text
                style={
                  styles.searchButtonText
                }
              >
                Search skills or
                categories...
              </Text>
            </Pressable>

            <View
              style={styles.creditCard}
            >
              <Text
                style={styles.creditLabel}
              >
                Available Skill Credits
              </Text>

              {currentUser ? (
                <Text
                  style={
                    styles.creditValue
                  }
                >
                  {currentUser.creditBalance}{" "}
                  hours
                </Text>
              ) : (
                <View
                  style={
                    styles.creditLoadingRow
                  }
                >
                  <ActivityIndicator
                    size="small"
                    color={COLORS.white}
                  />

                  <Text
                    style={
                      styles.creditLoadingText
                    }
                  >
                    Loading credits...
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={styles.sectionTitle}
            >
              Recommended Skills
            </Text>
          </View>
        }
        ListEmptyComponent={
          skillsLoading
            ? renderLoadingState()
            : skillsError
              ? renderErrorState()
              : renderEmptyState()
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },

  header: {
    marginBottom: SPACING.md,
  },

  greeting: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: SPACING.sm,
  },

  subtitleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:
      "space-between",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  subtitle: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  requestSkillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor:
      COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  requestSkillButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 13,
    marginBottom: SPACING.lg,
  },

  searchButtonText: {
    color: COLORS.textLight,
    fontSize: 14,
  },

  creditCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  creditLabel: {
    color: COLORS.primaryLight,
    fontSize: 13,
    marginBottom: SPACING.xs,
  },

  creditValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
  },

  creditLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  creditLoadingText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },

  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },

  stateTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: SPACING.md,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  emptyRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor:
      COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: SPACING.md,
  },

  emptyRequestButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});