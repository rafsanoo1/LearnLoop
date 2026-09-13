import SkillCard from "@/components/skill-card";
import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";
import { useLearnLoop } from "@/context/LearnLoopContext";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchSkillsScreen() {
  const [query, setQuery] = useState("");

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

  useEffect(() => {
    if (skills.length === 0) {
      void loadSkills();
    }
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

  const searchText =
    query.trim().toLowerCase();

  const filteredSkills = skills.filter(
    (skill) => {
      if (!skill.isActive) {
        return false;
      }

      if (!searchText) {
        return true;
      }

      const mentorName =
        users[
          skill.mentorId
        ]?.name.toLowerCase() ?? "";

      return (
        skill.title
          .toLowerCase()
          .includes(searchText) ||
        skill.category
          .toLowerCase()
          .includes(searchText) ||
        skill.description
          .toLowerCase()
          .includes(searchText) ||
        mentorName.includes(searchText)
      );
    }
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
        Please wait while LearnLoop loads
        the available skills.
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
        name="search-outline"
        size={42}
        color={COLORS.textLight}
      />

      <Text style={styles.stateTitle}>
        No skills found
      </Text>

      <Text style={styles.stateMessage}>
        {query.trim()
          ? `No skills match “${query.trim()}”. Try another keyword, mentor, or category.`
          : "There are currently no active skills available."}
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
          size={18}
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
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={styles.searchContainer}
      >
        <View
          style={
            styles.searchInputContainer
          }
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.textLight}
          />

          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search skills, categories, or mentors..."
            placeholderTextColor={
              COLORS.textLight
            }
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search skills, categories, or mentors"
          />

          {query.length > 0 ? (
            <Pressable
              onPress={() =>
                setQuery("")
              }
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={
                  COLORS.textLight
                }
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {skillsLoading ? (
        renderLoadingState()
      ) : skillsError ? (
        renderErrorState()
      ) : (
        <FlatList
          data={filteredSkills}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={({ item }) => (
            <SkillCard
              skill={item}
              mentorName={getMentorName(
                item.mentorId
              )}
              onPress={
                handleSkillPress
              }
            />
          )}
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
          ListHeaderComponent={
            filteredSkills.length > 0 ? (
              <Text
                style={
                  styles.resultText
                }
              >
                {query.trim()
                  ? `${filteredSkills.length} result${
                      filteredSkills.length ===
                      1
                        ? ""
                        : "s"
                    } found`
                  : `${filteredSkills.length} available skill${
                      filteredSkills.length ===
                      1
                        ? ""
                        : "s"
                    }`}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            renderEmptyState()
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  searchContainer: {
    padding: SPACING.md,
    backgroundColor:
      COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal:
      SPACING.md,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal:
      SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },

  resultText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
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
    maxWidth: 420,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor:
      COLORS.primary,
    paddingHorizontal:
      SPACING.lg,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  requestSkillButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor:
      COLORS.primaryLight,
    paddingHorizontal:
      SPACING.lg,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },

  requestSkillButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});