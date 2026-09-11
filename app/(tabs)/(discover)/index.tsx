import SkillCard from "@/components/skill-card";
import { COLORS, SPACING } from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { USERS } from "@/data/users";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DiscoverScreen() {
  const activeSkills = SKILL_OFFERS.filter(
    (skill) => skill.isActive
  );

  const getMentorName = (mentorId: string) => {
    return (
      USERS.find((user) => user.id === mentorId)?.name ??
      "Unknown Mentor"
    );
  };

  const handleSkillPress = (skill: SkillOffer) => {
    router.push({
      pathname: "/(tabs)/(discover)/skill/[id]",
      params: { id: skill.id },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={activeSkills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillCard
            skill={item}
            mentorName={getMentorName(item.mentorId)}
            onPress={handleSkillPress}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Hello, Rafsan 👋
            </Text>

            <Text style={styles.title}>
              What do you want to learn?
            </Text>

            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>
                Exchange your time and learn from students
                around campus.
              </Text>

              <Pressable
                style={styles.requestSkillButton}
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

                <Text style={styles.requestSkillButtonText}>
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

              <Text style={styles.searchButtonText}>
                Search skills or categories...
              </Text>
            </Pressable>

            <View style={styles.creditCard}>
              <Text style={styles.creditLabel}>
                Available Skill Credits
              </Text>

              <Text style={styles.creditValue}>
                3.5 hours
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              Recommended Skills
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
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
    justifyContent: "space-between",
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
    backgroundColor: COLORS.primaryLight,
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
    backgroundColor: COLORS.surface,
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

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
});