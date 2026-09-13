import { COLORS } from "@/constants/learnloop-theme";
import { SkillSession } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SessionCardProps {
  session: SkillSession;
  skillTitle: string;
  participantName: string;
  participantRole: "Mentor" | "Learner";
  onPress: () => void;
}

const STATUS_COLORS: Record<
  SkillSession["status"],
  { backgroundColor: string; textColor: string }
> = {
  pending: {
    backgroundColor: "#FEF3C7",
    textColor: "#B45309",
  },
  accepted: {
    backgroundColor: "#DCFCE7",
    textColor: "#15803D",
  },
  completed: {
    backgroundColor: "#DBEAFE",
    textColor: "#1D4ED8",
  },
  rejected: {
    backgroundColor: "#FEE2E2",
    textColor: "#B91C1C",
  },
  cancelled: {
    backgroundColor: "#F3F4F6",
    textColor: "#4B5563",
  },
};

export default function SessionCard({
  session,
  skillTitle,
  participantName,
  participantRole,
  onPress,
}: SessionCardProps) {
  const statusColors = STATUS_COLORS[session.status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
    >

      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {skillTitle}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors.backgroundColor },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColors.textColor },
            ]}
          >
            {session.status}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons
          name="person-outline"
          size={17}
          color={COLORS.primary}
        />

        <Text style={styles.participantText}>
          {participantRole}: {participantName}
        </Text>
      </View>

      <View style={styles.informationRow}>
        <View style={styles.informationItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.informationText}>
            {session.scheduledDate}
          </Text>
        </View>

        <View style={styles.informationItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.informationText}>
            {session.scheduledTime}
          </Text>
        </View>
      </View>

      <View style={styles.informationRow}>
        <View style={styles.informationItem}>
          <Ionicons
            name={
              session.mode === "Online"
                ? "videocam-outline"
                : "location-outline"
            }
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.informationText}>
            {session.mode}
          </Text>
        </View>

        <View style={styles.informationItem}>
          <Ionicons
            name="hourglass-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.informationText}>
            {session.duration} minutes
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.creditText}>
          {session.creditCost}{" "}
          {session.creditCost === 1 ? "credit" : "credits"}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={COLORS.primary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  pressedCard: {
    opacity: 0.75,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  participantText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
  },
  informationRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  informationItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  informationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 7,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  creditText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
});