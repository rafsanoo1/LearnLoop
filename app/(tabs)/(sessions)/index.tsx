
import SessionCard from "@/components/session-card";
import { SESSIONS } from "@/data/sessions";
import { SkillSession } from "@/types/learnloop";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { SKILL_OFFERS } from "@/data/skills";
import { USERS } from "@/data/users";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SessionFilter = "upcoming" | "completed";

const CURRENT_USER_ID = "u1";

export default function SessionsScreen() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] =
    useState<SessionFilter>("upcoming");

  const mySessions = SESSIONS.filter(
    (session) =>
      session.mentorId === CURRENT_USER_ID ||
      session.learnerId === CURRENT_USER_ID,
  );

  const upcomingSessions = mySessions.filter(
    (session) =>
      session.status === "pending" ||
      session.status === "accepted",
  );

  const completedSessions = mySessions.filter(
    (session) =>
      session.status === "completed" ||
      session.status === "cancelled" ||
      session.status === "rejected",
  );

  const visibleSessions =
    selectedFilter === "upcoming"
      ? upcomingSessions
      : completedSessions;

      const getSkillTitle = (session: SkillSession) => {
  const skillOffer = SKILL_OFFERS.find(
    (offer) => offer.id === session.skillOfferId,
  );

  return skillOffer?.title ?? "Skill Session";
};

  
  const getParticipant = (session: SkillSession) => {
  const currentUserIsLearner =
    session.learnerId === CURRENT_USER_ID;

  const participantId = currentUserIsLearner
    ? session.mentorId
    : session.learnerId;

  const participant = USERS.find(
    (user) => user.id === participantId,
  );

  return {
    name: participant?.name ?? "Unknown user",
    role: currentUserIsLearner
      ? ("Mentor" as const)
      : ("Learner" as const),
  };
};


  const openSessionDetails = (sessionId: string) => {
    router.push(
      `/(tabs)/(sessions)/${sessionId}` as Href,
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>My Sessions</Text>

        <Text style={styles.description}>
          Manage your upcoming and completed learning sessions.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {upcomingSessions.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Upcoming
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {completedSessions.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Completed
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              selectedFilter === "upcoming" &&
                styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedFilter("upcoming")
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "upcoming" &&
                  styles.activeFilterText,
              ]}
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedFilter === "completed" &&
                styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedFilter("completed")
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "completed" &&
                  styles.activeFilterText,
              ]}
            >
              Completed
            </Text>
          </Pressable>
        </View>

        {visibleSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>

            <Text style={styles.emptyTitle}>
              No sessions found
            </Text>

            <Text style={styles.emptyDescription}>
              There are no sessions in this section.
            </Text>
          </View>
        ) : (
          visibleSessions.map((session) => {
            const participant =
              getParticipant(session);

            return (
              <SessionCard
                key={session.id}
                session={session}
                skillTitle={getSkillTitle(session)}
                participantName={participant.name}
                participantRole={participant.role}
                onPress={() =>
                  openSessionDetails(session.id)
                }
              />
            );
          })
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },

  heading: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },

  summaryNumber: {
    color: "#635BFF",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 4,
  },

  summaryLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },

  filterButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 9,
    paddingVertical: 11,
  },

  activeFilterButton: {
    backgroundColor: "#FFFFFF",
  },

  filterText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },

  activeFilterText: {
    color: "#635BFF",
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 40,
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
  },

  emptyDescription: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
  },
});