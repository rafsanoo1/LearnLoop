import ProfileStatCard from "@/components/profile-stat-card";
import { COLORS } from "@/constants/learnloop-theme";
import { TRANSACTIONS } from "@/data/transactions";
import { USERS } from "@/data/users";
import { CreditTransaction } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CURRENT_USER_ID = "u1";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface TransactionStyle {
  icon: IoniconName;
  backgroundColor: string;
  color: string;
  prefix: string;
}

function getTransactionStyle(
  type: CreditTransaction["type"],
): TransactionStyle {
  switch (type) {
    case "earned":
      return {
        icon: "arrow-down-circle-outline",
        backgroundColor: "#DCFCE7",
        color: "#15803D",
        prefix: "+",
      };

    case "spent":
      return {
        icon: "arrow-up-circle-outline",
        backgroundColor: "#FEE2E2",
        color: "#B91C1C",
        prefix: "-",
      };

    case "bonus":
      return {
        icon: "gift-outline",
        backgroundColor: "#FEF3C7",
        color: "#B45309",
        prefix: "+",
      };

    case "refund":
      return {
        icon: "refresh-circle-outline",
        backgroundColor: "#DBEAFE",
        color: "#1D4ED8",
        prefix: "+",
      };
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileScreen() {
  const router = useRouter();

  const currentUser = USERS.find(
    (user) => user.id === CURRENT_USER_ID,
  );

  const userTransactions = TRANSACTIONS.filter(
    (transaction) =>
      transaction.userId === CURRENT_USER_ID,
  )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )
    .slice(0, 5);

  if (!currentUser) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons
          name="person-circle-outline"
          size={60}
          color={COLORS.textSecondary}
        />

        <Text style={styles.notFoundTitle}>
          Profile not found
        </Text>

        <Text style={styles.notFoundDescription}>
          The current user profile is unavailable.
        </Text>
      </View>
    );
  }

  const initials = currentUser.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openEditProfile = () => {
    router.push("/edit-profile");
  };

  const openCreditHistory = () => {
    router.push("/credit-history");
  };

  const openSettings = () => {
    router.push("/settings");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>

        <View style={styles.profileInformation}>
          <Text style={styles.name}>
            {currentUser.name}
          </Text>

          <Text style={styles.studentId}>
            {currentUser.studentId}
          </Text>

          <Text style={styles.academicInformation}>
            {currentUser.department} •{" "}
            {currentUser.semester}
          </Text>
        </View>
      </View>

      {/* PROFILE ACTION BUTTONS */}
      <View style={styles.profileActions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={openEditProfile}
        >
          <Ionicons
            name="create-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.actionButtonText}>
            Edit Profile
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={openCreditHistory}
        >
          <Ionicons
            name="wallet-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.actionButtonText}>
            Credit History
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={openSettings}
        >
          <Ionicons
            name="settings-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.actionButtonText}>
            Settings
          </Text>
        </Pressable>
      </View>

      {/* CREDIT BALANCE */}
      <View style={styles.creditCard}>
        <View style={styles.creditIcon}>
          <Ionicons
            name="wallet-outline"
            size={28}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.creditInformation}>
          <Text style={styles.creditLabel}>
            Credit Balance
          </Text>

          <Text style={styles.creditValue}>
            {currentUser.creditBalance}
          </Text>
        </View>

        <Text style={styles.creditUnit}>
          {currentUser.creditBalance === 1
            ? "credit"
            : "credits"}
        </Text>
      </View>

      {/* STATISTICS */}
      <View style={styles.statisticsContainer}>
        <ProfileStatCard
          icon="star-outline"
          value={currentUser.rating.toFixed(1)}
          label="Rating"
        />

        <ProfileStatCard
          icon="checkmark-circle-outline"
          value={currentUser.completedSessions}
          label="Sessions"
        />

        <ProfileStatCard
          icon="school-outline"
          value={currentUser.learnSkills.length}
          label="Learning"
        />
      </View>

      {/* ABOUT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          About Me
        </Text>

        <Text style={styles.bio}>
          {currentUser.bio ||
            "No biography added yet."}
        </Text>
      </View>

      {/* TEACHING SKILLS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Skills I Teach
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {currentUser.teachSkills.length}
            </Text>
          </View>
        </View>

        {currentUser.teachSkills.length > 0 ? (
          <View style={styles.skillsContainer}>
            {currentUser.teachSkills.map((skill) => (
              <View
                key={`teach-${skill}`}
                style={styles.teachSkillChip}
              >
                <Ionicons
                  name="bulb-outline"
                  size={15}
                  color="#4338CA"
                />

                <Text style={styles.teachSkillText}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No teaching skills added.
          </Text>
        )}
      </View>

      {/* LEARNING SKILLS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Skills I Want to Learn
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {currentUser.learnSkills.length}
            </Text>
          </View>
        </View>

        {currentUser.learnSkills.length > 0 ? (
          <View style={styles.skillsContainer}>
            {currentUser.learnSkills.map((skill) => (
              <View
                key={`learn-${skill}`}
                style={styles.learnSkillChip}
              >
                <Ionicons
                  name="book-outline"
                  size={15}
                  color="#0369A1"
                />

                <Text style={styles.learnSkillText}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No learning skills added.
          </Text>
        )}
      </View>

      {/* RECENT ACTIVITY */}
      <View style={styles.section}>
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>

          <Pressable onPress={openCreditHistory}>
            <Text style={styles.viewAllText}>
              View All
            </Text>
          </Pressable>
        </View>

        {userTransactions.length > 0 ? (
          userTransactions.map((transaction) => {
            const transactionStyle =
              getTransactionStyle(transaction.type);

            return (
              <View
                key={transaction.id}
                style={styles.transactionRow}
              >
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transactionStyle.backgroundColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={transactionStyle.icon}
                    size={21}
                    color={transactionStyle.color}
                  />
                </View>

                <View
                  style={
                    styles.transactionInformation
                  }
                >
                  <Text
                    style={
                      styles.transactionDescription
                    }
                    numberOfLines={2}
                  >
                    {transaction.description}
                  </Text>

                  <Text
                    style={styles.transactionDate}
                  >
                    {formatDate(transaction.date)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        transactionStyle.color,
                    },
                  ]}
                >
                  {transactionStyle.prefix}
                  {transaction.amount}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyActivity}>
            <Ionicons
              name="receipt-outline"
              size={34}
              color={COLORS.textSecondary}
            />

            <Text style={styles.emptyText}>
              No recent activity.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
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

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  avatar: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 36,
    marginRight: 16,
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  profileInformation: {
    flex: 1,
  },

  name: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },

  studentId: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
  },

  academicInformation: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  profileActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  actionButton: {
    flex: 1,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  actionButtonPressed: {
    opacity: 0.7,
  },

  actionButtonText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  creditCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  creditIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255, 255, 255, 0.18)",
    borderRadius: 15,
    marginRight: 14,
  },

  creditInformation: {
    flex: 1,
  },

  creditLabel: {
    color: "#E0E7FF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },

  creditValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  creditUnit: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  statisticsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },

  section: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  countBadge: {
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 14,
  },

  countText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  viewAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
  },

  bio: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  teachSkillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  teachSkillText: {
    color: "#4338CA",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  learnSkillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  learnSkillText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginRight: 12,
  },

  transactionInformation: {
    flex: 1,
    marginRight: 10,
  },

  transactionDescription: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 4,
  },

  transactionDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyActivity: {
    alignItems: "center",
    paddingVertical: 24,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
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
    marginTop: 12,
    marginBottom: 7,
  },

  notFoundDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});