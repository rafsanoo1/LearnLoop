import { COLORS } from "@/constants/learnloop-theme";
import { SESSIONS } from "@/data/sessions";
import * as SkillsData from "@/data/skills";
import * as UsersData from "@/data/users";
import {
  SkillOffer,
  SkillSession,
  User,
} from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const usersModule = UsersData as Record<string, unknown>;
const skillsModule = SkillsData as Record<string, unknown>;

const USERS = (usersModule.USERS ??
  usersModule.users ??
  []) as User[];

const SKILL_OFFERS = (skillsModule.SKILL_OFFERS ??
  skillsModule.SKILLS ??
  skillsModule.skills ??
  []) as SkillOffer[];

const STATUS_COLOURS: Record<
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

interface DetailRowProps {
  icon:
    | "calendar-outline"
    | "time-outline"
    | "hourglass-outline"
    | "videocam-outline"
    | "location-outline"
    | "wallet-outline";
  label: string;
  value: string;
}

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function SessionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const session = SESSIONS.find(
    (item) => item.id === id,
  );

  if (!session) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen
          options={{
            title: "Session Details",
          }}
        />

        <Ionicons
          name="alert-circle-outline"
          size={54}
          color={COLORS.textSecondary}
        />

        <Text style={styles.notFoundTitle}>
          Session not found
        </Text>

        <Text style={styles.notFoundText}>
          This session may no longer be available.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const skillOffer = SKILL_OFFERS.find(
    (offer) => offer.id === session.skillOfferId,
  );

  const mentor = USERS.find(
    (user) => user.id === session.mentorId,
  );

  const learner = USERS.find(
    (user) => user.id === session.learnerId,
  );

  const statusColours =
    STATUS_COLOURS[session.status];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Session Details",
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <Text style={styles.skillTitle}>
              {skillOffer?.title ?? "Skill Session"}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    statusColours.backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: statusColours.textColor,
                  },
                ]}
              >
                {session.status}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>
            {skillOffer?.category ?? "Learning Session"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants
          </Text>

          <View style={styles.personCard}>
            <View style={styles.personIcon}>
              <Ionicons
                name="person-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <View>
              <Text style={styles.personRole}>Mentor</Text>
              <Text style={styles.personName}>
                {mentor?.name ?? session.mentorId}
              </Text>
            </View>
          </View>

          <View style={styles.personCard}>
            <View style={styles.personIcon}>
              <Ionicons
                name="school-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <View>
              <Text style={styles.personRole}>Learner</Text>
              <Text style={styles.personName}>
                {learner?.name ?? session.learnerId}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Schedule
          </Text>

          <DetailRow
            icon="calendar-outline"
            label="Date"
            value={session.scheduledDate}
          />

          <DetailRow
            icon="time-outline"
            label="Time"
            value={session.scheduledTime}
          />

          <DetailRow
            icon="hourglass-outline"
            label="Duration"
            value={`${session.duration} minutes`}
          />

          <DetailRow
            icon={
              session.mode === "Online"
                ? "videocam-outline"
                : "location-outline"
            }
            label="Mode"
            value={session.mode}
          />

          <DetailRow
            icon="wallet-outline"
            label="Credit cost"
            value={`${session.creditCost} ${
              session.creditCost === 1
                ? "credit"
                : "credits"
            }`}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Learning Objective
          </Text>

          <Text style={styles.objective}>
            {session.objective}
          </Text>
        </View>

        {skillOffer?.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              About the Skill
            </Text>

            <Text style={styles.description}>
              {skillOffer.description}
            </Text>
          </View>
        ) : null}
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
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  skillTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginRight: 12,
  },
  category: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  section: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  personIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 22,
    marginRight: 12,
  },
  personRole: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  personName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  objective: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
    padding: 24,
  },
  notFoundTitle: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },
  notFoundText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 22,
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
});
