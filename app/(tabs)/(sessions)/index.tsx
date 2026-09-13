import SessionCard from "@/components/session-card";
import { getSessions } from "@/services/sessionService";
import { getSkillById } from "@/services/skillService";
import { getUserById } from "@/services/userService";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SessionFilter = "upcoming" | "completed";

type SessionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

interface ApiSession {
  _id: string;
  skillOfferId: string;
  mentorId: string;
  learnerId: string;
  scheduledDate: string;
  scheduledTime: string | number;
  duration: number;
  creditCost: number;
  objective: string;
  mode: "Online" | "In Person";
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

interface DisplaySession {
  id: string;
  skillOfferId: string;
  mentorId: string;
  learnerId: string;
  scheduledDate: string;
  scheduledTime: string | number;
  duration: number;
  creditCost: number;
  objective: string;
  mode: "Online" | "In Person";
  status: SessionStatus;
}

interface ParticipantInfo {
  name: string;
  role: "Mentor" | "Learner";
}

const CURRENT_USER_ID = "u1";

/*
 * Formats inconsistent time values from the database.
 *
 * Examples:
 * "3:00 PM" -> "3:00 PM"
 * "5"       -> "5:00 PM"
 * 6         -> "6:00 PM"
 * "17"      -> "5:00 PM"
 * "5:30"    -> "5:30 AM"
 */
const formatSessionTime = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined) {
    return "—";
  }

  const raw = String(value).trim();

  if (!raw) {
    return "—";
  }

  // Already formatted, e.g. "3:00 PM"
  if (/[AaPp][Mm]$/.test(raw)) {
    return raw;
  }

  // Numeric values such as 5, 7, 17
  const numericValue = Number(raw);

  if (!Number.isNaN(numericValue)) {
    let hour = numericValue;

    if (hour >= 0 && hour <= 23) {
      const period = hour >= 12 ? "PM" : "AM";

      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour -= 12;
      }

      return `${hour}:00 ${period}`;
    }
  }

  // Values such as "5:30"
  const timeMatch = raw.match(
    /^(\d{1,2}):(\d{2})$/,
  );

  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minutes = timeMatch[2];

    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  }

  return raw;
};

export default function SessionsScreen() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] =
    useState<SessionFilter>("upcoming");

  const [sessions, setSessions] = useState<
    DisplaySession[]
  >([]);

  const [skillTitles, setSkillTitles] =
    useState<Record<string, string>>({});

  const [participantNames, setParticipantNames] =
    useState<Record<string, string>>({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: ApiSession[] =
        await getSessions();

      const normalizedSessions: DisplaySession[] =
        data
          .filter(
            (session) =>
              session.mentorId ===
                CURRENT_USER_ID ||
              session.learnerId ===
                CURRENT_USER_ID,
          )
          .map((session) => ({
            id: session._id,
            skillOfferId:
              session.skillOfferId,
            mentorId: session.mentorId,
            learnerId: session.learnerId,
            scheduledDate:
              session.scheduledDate,
            scheduledTime:
              session.scheduledTime,
            duration: session.duration,
            creditCost:
              session.creditCost,
            objective:
              session.objective,
            mode: session.mode,
            status: session.status,
          }));

      setSessions(normalizedSessions);

      /*
       * Load real skill titles.
       */
      const uniqueSkillIds = [
        ...new Set(
          normalizedSessions.map(
            (session) =>
              session.skillOfferId,
          ),
        ),
      ];

      const skillResults =
        await Promise.all(
          uniqueSkillIds.map(
            async (skillId) => {
              try {
                const skill =
                  await getSkillById(
                    skillId,
                  );

                return {
                  id: skillId,
                  title: skill.title,
                };
              } catch {
                return {
                  id: skillId,
                  title: "Skill Session",
                };
              }
            },
          ),
        );

      const newSkillTitles: Record<
        string,
        string
      > = {};

      skillResults.forEach((skill) => {
        newSkillTitles[skill.id] =
          skill.title;
      });

      setSkillTitles(
        newSkillTitles,
      );

      /*
       * Load real participant names.
       */
      const participantIds = [
        ...new Set(
          normalizedSessions.map(
            (session) =>
              session.mentorId ===
              CURRENT_USER_ID
                ? session.learnerId
                : session.mentorId,
          ),
        ),
      ];

      const participantResults =
        await Promise.all(
          participantIds.map(
            async (userId) => {
              try {
                const user =
                  await getUserById(
                    userId,
                  );

                return {
                  id: userId,
                  name: user.name,
                };
              } catch {
                return {
                  id: userId,
                  name: "Unknown user",
                };
              }
            },
          ),
        );

      const newParticipantNames: Record<
        string,
        string
      > = {};

      participantResults.forEach(
        (participant) => {
          newParticipantNames[
            participant.id
          ] = participant.name;
        },
      );

      setParticipantNames(
        newParticipantNames,
      );
    } catch (err) {
      console.error(
        "Failed to load sessions:",
        err,
      );

      setError(
        "Unable to load your sessions. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  /*
   * Upcoming sessions:
   * pending + accepted only.
   *
   * Cancelled/rejected sessions are excluded.
   */
  const upcomingSessions =
    sessions.filter(
      (session) =>
        session.status === "pending" ||
        session.status === "accepted",
    );

  /*
   * Completed sessions:
   * completed only.
   */
  const completedSessions =
    sessions.filter(
      (session) =>
        session.status === "completed",
    );

  const visibleSessions =
    selectedFilter === "upcoming"
      ? upcomingSessions
      : completedSessions;

  const getParticipant = (
    session: DisplaySession,
  ): ParticipantInfo => {
    const currentUserIsLearner =
      session.learnerId ===
      CURRENT_USER_ID;

    const participantId =
      currentUserIsLearner
        ? session.mentorId
        : session.learnerId;

    return {
      name:
        participantNames[
          participantId
        ] ?? "Unknown user",

      role: currentUserIsLearner
        ? "Mentor"
        : "Learner",
    };
  };

  const getSkillTitle = (
    session: DisplaySession,
  ) => {
    return (
      skillTitles[
        session.skillOfferId
      ] ?? "Skill Session"
    );
  };

  const openSessionDetails = (
    sessionId: string,
  ) => {
    router.push(
      `/(tabs)/(sessions)/${sessionId}` as Href,
    );
  };

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator
          size="large"
          color="#635BFF"
        />

        <Text style={styles.loadingText}>
          Loading sessions...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.heading}>
          My Sessions
        </Text>

        <Text style={styles.description}>
          Manage your upcoming and completed
          learning sessions.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text
              style={styles.summaryNumber}
            >
              {upcomingSessions.length}
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              Upcoming
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text
              style={styles.summaryNumber}
            >
              {completedSessions.length}
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              Completed
            </Text>
          </View>
        </View>

        <View
          style={styles.filterContainer}
        >
          <Pressable
            style={[
              styles.filterButton,
              selectedFilter ===
                "upcoming" &&
                styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedFilter(
                "upcoming",
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter ===
                  "upcoming" &&
                  styles.activeFilterText,
              ]}
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedFilter ===
                "completed" &&
                styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedFilter(
                "completed",
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter ===
                  "completed" &&
                  styles.activeFilterText,
              ]}
            >
              Completed
            </Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.emptyState}>
            <Text
              style={styles.emptyIcon}
            >
              !
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              Unable to load sessions
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={loadSessions}
            >
              <Text
                style={styles.retryText}
              >
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : visibleSessions.length ===
          0 ? (
          <View style={styles.emptyState}>
            <Text
              style={styles.emptyIcon}
            >
              📅
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No sessions found
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              There are no sessions in this
              section.
            </Text>
          </View>
        ) : (
          visibleSessions.map(
            (session) => {
              const participant =
                getParticipant(
                  session,
                );

              /*
               * SessionCard receives the
               * normalized session.
               *
               * The scheduledTime is also
               * normalized here so the card
               * receives a consistent value.
               */
              const displaySession = {
                ...session,
                scheduledTime:
                  formatSessionTime(
                    session.scheduledTime,
                  ),
              };

              return (
                <SessionCard
                  key={session.id}
                  session={
                    displaySession as any
                  }
                  skillTitle={getSkillTitle(
                    session,
                  )}
                  participantName={
                    participant.name
                  }
                  participantRole={
                    participant.role
                  }
                  onPress={() =>
                    openSessionDetails(
                      session.id,
                    )
                  }
                />
              );
            },
          )
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

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
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

  retryButton: {
    backgroundColor: "#635BFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 18,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});