import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { USERS } from "@/data/users";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SkillDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const skill = SKILL_OFFERS.find((item) => item.id === id);
  const mentor = USERS.find((user) => user.id === skill?.mentorId);

  if (!skill) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Skill not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{skill.category}</Text>
      </View>

      <Text style={styles.title}>{skill.title}</Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={17} color={COLORS.warning} />
        <Text style={styles.ratingText}>{skill.rating}</Text>
      </View>

      <View style={styles.mentorCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mentor?.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </Text>
        </View>

        <View>
          <Text style={styles.mentorLabel}>Mentor</Text>
          <Text style={styles.mentorName}>
            {mentor?.name ?? "Unknown Mentor"}
          </Text>
          <Text style={styles.mentorDepartment}>
            {mentor?.department}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About this skill</Text>
      <Text style={styles.description}>{skill.description}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Level</Text>
          <Text style={styles.infoValue}>{skill.level}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{skill.duration} minutes</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mode</Text>
          <Text style={styles.infoValue}>{skill.mode}</Text>
        </View>

        {skill.location ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{skill.location}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Available days</Text>

      <View style={styles.daysContainer}>
        {skill.availableDays.map((day) => (
          <View key={day} style={styles.dayBadge}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.requestButton}
        onPress={() =>
            router.push({
            pathname: "/(tabs)/(discover)/request/[id]",
            params: { id: skill.id },
         })
         } 
        >
        <Text style={styles.requestButtonText}>Request Session</Text>
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
    backgroundColor: COLORS.primaryLight,
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
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
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
  requestButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  requestButtonText: {
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