import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OfferCardProps {
  offer: SkillOffer;
  onEdit: (offer: SkillOffer) => void;
}

export default function OfferCard({
  offer,
  onEdit,
}: OfferCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.statusBadge,
            offer.isActive
              ? styles.activeBadge
              : styles.pausedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              offer.isActive
                ? styles.activeText
                : styles.pausedText,
            ]}
          >
            {offer.isActive ? "Active" : "Paused"}
          </Text>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(offer)}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.category}>{offer.category}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {offer.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.textSecondary}
          />
          <Text style={styles.infoText}>
            {offer.duration} min
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="location-outline"
            size={15}
            color={COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{offer.mode}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="school-outline"
            size={15}
            color={COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{offer.level}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
  },
  pausedBadge: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  activeText: {
    color: COLORS.success,
  },
  pausedText: {
    color: COLORS.warning,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  category: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: SPACING.sm,
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
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});