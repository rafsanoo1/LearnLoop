import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SkillCardProps {
  skill: SkillOffer;
  mentorName: string;
  onPress: (skill: SkillOffer) => void;
}

export default function SkillCard({
  skill,
  mentorName,
  onPress,
}: SkillCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(skill)}
      activeOpacity={0.75}
    >
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{skill.category}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={COLORS.warning} />
          <Text style={styles.ratingText}>{skill.rating}</Text>
        </View>
      </View>

      <Text style={styles.title}>{skill.title}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {skill.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="person-outline"
            size={15}
            color={COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{mentorName}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{skill.duration} min</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.levelText}>{skill.level}</Text>
        <Text style={styles.modeText}>{skill.mode}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  categoryText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  levelText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  modeText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
});