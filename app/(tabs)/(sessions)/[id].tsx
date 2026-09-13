import { COLORS } from "@/constants/learnloop-theme";

import {
  getSessionById,
  updateSession,
} from "@/services/sessionService";

import { getSkills } from "@/services/skillService";
import { getUserById, AppUser } from "@/services/userService";

import {
  SkillOffer,
  SkillSession,
} from "@/types/learnloop";

import { Ionicons } from "@expo/vector-icons";

import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";


const CURRENT_USER_ID = "u1";


const STATUS_COLOURS: Record<
  SkillSession["status"],
  {
    backgroundColor: string;
    textColor: string;
  }
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

        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text style={styles.detailValue}>
          {value}
        </Text>

      </View>

    </View>
  );
}


export default function SessionDetailsScreen() {

  const router = useRouter();

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();


  const [session, setSession] =
    useState<SkillSession | null>(null);

  const [skillOffer, setSkillOffer] =
    useState<SkillOffer | null>(null);

  const [mentor, setMentor] =
    useState<AppUser | null>(null);

  const [learner, setLearner] =
    useState<AppUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadSession = async () => {

      try {

        setLoading(true);
        setError("");

        if (!id) {
          setError("Session ID is missing.");
          return;
        }


        const sessionData =
          await getSessionById(id);


        const formattedSession:
          SkillSession = {
          ...sessionData,

          id:
            sessionData.id ??
            sessionData._id,
        };


        setSession(formattedSession);


        /*
         * Load the real skill from MongoDB.
         */
        const skills =
          await getSkills();


        const foundSkill =
          skills.find(
            (skill: any) =>
              skill.id ===
                sessionData.skillOfferId ||
              skill._id ===
                sessionData.skillOfferId
          );


        setSkillOffer(
          foundSkill ?? null
        );


        /*
         * Load real mentor information
         * from the API.
         */
        try {

          const mentorData =
            await getUserById(
              sessionData.mentorId
            );

          setMentor(mentorData);

        } catch (userError) {

          console.log(
            "Unable to load mentor:",
            userError
          );

        }


        /*
         * Load real learner information
         * from the API.
         */
        try {

          const learnerData =
            await getUserById(
              sessionData.learnerId
            );

          setLearner(learnerData);

        } catch (userError) {

          console.log(
            "Unable to load learner:",
            userError
          );

        }

      } catch (error) {

        console.log(
          "Load session details error:",
          error
        );

        setError(
          "Unable to load this session."
        );

      } finally {

        setLoading(false);

      }

    };


    loadSession();

  }, [id]);


  const changeStatus = async (
    newStatus:
      | "accepted"
      | "rejected"
      | "completed"
      | "cancelled"
  ) => {

    if (!session) {
      return;
    }


    try {

      setUpdating(true);


      const updatedSession =
        await updateSession(
          session.id,
          {
            status: newStatus,
          }
        );


      const formattedSession:
        SkillSession = {

        ...updatedSession,

        id:
          updatedSession.id ??
          updatedSession._id,
      };


      setSession(
        formattedSession
      );


      /*
       * After rejecting or cancelling,
       * return to the Sessions screen.
       */
      if (
        newStatus === "cancelled" ||
        newStatus === "rejected"
      ) {

        setTimeout(() => {

          router.replace(
            "/(tabs)/(sessions)" as any
          );

        }, 300);

      }

    } catch (error) {

      console.log(
        "Update session status error:",
        error
      );


      const message =
        "Failed to update session status.";


      if (Platform.OS === "web") {

        window.alert(message);

      } else {

        Alert.alert(
          "Error",
          message
        );

      }

    } finally {

      setUpdating(false);

    }

  };


  const confirmStatusChange = (
    newStatus:
      | "accepted"
      | "rejected"
      | "completed"
      | "cancelled"
  ) => {

    let actionText = "";

    switch (newStatus) {

      case "accepted":
        actionText = "accept this session";
        break;

      case "rejected":
        actionText = "reject this session";
        break;

      case "completed":
        actionText = "mark this session as completed";
        break;

      case "cancelled":
        actionText = "cancel this session";
        break;

    }


    const statusLabel =
      newStatus.charAt(0).toUpperCase() +
      newStatus.slice(1);


    if (Platform.OS === "web") {

      const confirmed =
        window.confirm(
          `Are you sure you want to ${actionText}?`
        );


      if (confirmed) {

        changeStatus(
          newStatus
        );

      }

      return;

    }


    Alert.alert(
      "Update Session",
      `Are you sure you want to ${actionText}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: statusLabel,
          onPress: () =>
            changeStatus(
              newStatus
            ),
        },
      ]
    );

  };


  if (loading) {

    return (
      <View style={styles.center}>

        <Text style={styles.messageText}>
          Loading session...
        </Text>

      </View>
    );

  }


  if (error || !session) {

    return (

      <View
        style={styles.notFoundContainer}
      >

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


        <Text
          style={styles.notFoundTitle}
        >
          Session not found
        </Text>


        <Text
          style={styles.notFoundText}
        >
          {error ||
            "This session may no longer be available."}
        </Text>


        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >

          <Text
            style={styles.backButtonText}
          >
            Go Back
          </Text>

        </Pressable>

      </View>

    );

  }


  const statusColours =
    STATUS_COLOURS[
      session.status
    ];


  /*
   * ROLE CHECK
   *
   * Learner takes priority.
   *
   * This prevents a user from accidentally
   * receiving both mentor and learner actions
   * if the API contains matching IDs.
   */
  const currentUserIsLearner =
    session.learnerId === CURRENT_USER_ID;


  const currentUserIsMentor =
    session.mentorId === CURRENT_USER_ID &&
    session.learnerId !== CURRENT_USER_ID;


  return (

    <>

      <Stack.Screen
        options={{
          title: "Session Details",
        }}
      />


      <ScrollView

        style={styles.screen}

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }

      >

        {/* HEADER */}

        <View
          style={styles.headerCard}
        >

          <View
            style={styles.headerTopRow}
          >

            <Text
              style={styles.skillTitle}
            >

              {skillOffer?.title ??
                "Skill Session"}

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
                    color:
                      statusColours.textColor,
                  },
                ]}
              >

                {session.status}

              </Text>

            </View>

          </View>


          <Text
            style={styles.category}
          >

            {skillOffer?.category ??
              "Learning Session"}

          </Text>

        </View>


        {/* PARTICIPANTS */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Participants
          </Text>


          <View
            style={styles.personCard}
          >

            <View
              style={styles.personIcon}
            >

              <Ionicons
                name="person-outline"
                size={22}
                color={COLORS.primary}
              />

            </View>


            <View>

              <Text
                style={styles.personRole}
              >
                Mentor
              </Text>


              <Text
                style={styles.personName}
              >

                {mentor?.name ??
                  session.mentorId}

              </Text>

            </View>

          </View>


          <View
            style={styles.personCard}
          >

            <View
              style={styles.personIcon}
            >

              <Ionicons
                name="school-outline"
                size={22}
                color={COLORS.primary}
              />

            </View>


            <View>

              <Text
                style={styles.personRole}
              >
                Learner
              </Text>


              <Text
                style={styles.personName}
              >

                {learner?.name ??
                  session.learnerId}

              </Text>

            </View>

          </View>

        </View>


        {/* SCHEDULE */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Schedule
          </Text>


          <DetailRow
            icon="calendar-outline"
            label="Date"
            value={
              session.scheduledDate
            }
          />


          <DetailRow
            icon="time-outline"
            label="Time"
            value={
              session.scheduledTime
            }
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


        {/* OBJECTIVE */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Learning Objective
          </Text>


          <Text
            style={styles.objective}
          >

            {session.objective}

          </Text>

        </View>


        {/* SKILL DESCRIPTION */}

        {skillOffer?.description ? (

          <View
            style={styles.section}
          >

            <Text
              style={styles.sectionTitle}
            >
              About the Skill
            </Text>


            <Text
              style={styles.description}
            >

              {skillOffer.description}

            </Text>

          </View>

        ) : null}


        {/* PENDING ACTIONS */}

        {session.status === "pending" && (

          <View
            style={styles.actionSection}
          >

            <Text
              style={styles.actionTitle}
            >
              Session Actions
            </Text>


            {/* MENTOR ACTIONS */}

            {currentUserIsMentor && (

              <>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.acceptButton,
                  ]}
                  disabled={updating}
                  onPress={() =>
                    confirmStatusChange(
                      "accepted"
                    )
                  }
                >

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />


                  <Text
                    style={
                      styles.actionButtonText
                    }
                  >

                    {updating
                      ? "Updating..."
                      : "Accept Session"}

                  </Text>

                </Pressable>


                <Pressable
                  style={[
                    styles.actionButton,
                    styles.rejectButton,
                  ]}
                  disabled={updating}
                  onPress={() =>
                    confirmStatusChange(
                      "rejected"
                    )
                  }
                >

                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />


                  <Text
                    style={
                      styles.actionButtonText
                    }
                  >
                    Reject Session
                  </Text>

                </Pressable>

              </>

            )}


            {/* LEARNER ACTION */}

            {currentUserIsLearner && (

              <Pressable
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                ]}
                disabled={updating}
                onPress={() =>
                  confirmStatusChange(
                    "cancelled"
                  )
                }
              >

                <Ionicons
                  name="close-outline"
                  size={20}
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.actionButtonText
                  }
                >
                  Cancel Request
                </Text>

              </Pressable>

            )}

          </View>

        )}


        {/* ACCEPTED ACTIONS */}

        {session.status === "accepted" && (

          <View
            style={styles.actionSection}
          >

            <Text
              style={styles.actionTitle}
            >
              Session Actions
            </Text>


            {/* MENTOR CAN COMPLETE */}

            {currentUserIsMentor && (

              <Pressable
                style={[
                  styles.actionButton,
                  styles.completeButton,
                ]}
                disabled={updating}
                onPress={() =>
                  confirmStatusChange(
                    "completed"
                  )
                }
              >

                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.actionButtonText
                  }
                >

                  {updating
                    ? "Updating..."
                    : "Mark as Completed"}

                </Text>

              </Pressable>

            )}


            {/* LEARNER CAN CANCEL */}

            {currentUserIsLearner && (

              <Pressable
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                ]}
                disabled={updating}
                onPress={() =>
                  confirmStatusChange(
                    "cancelled"
                  )
                }
              >

                <Ionicons
                  name="close-outline"
                  size={20}
                  color="#FFFFFF"
                />


                <Text
                  style={
                    styles.actionButtonText
                  }
                >
                  Cancel Session
                </Text>

              </Pressable>

            )}

          </View>

        )}


        {/* RESCHEDULE */}

        {session.status === "accepted" && (

          <Pressable
            style={
              styles.rescheduleButton
            }
            onPress={() =>
              router.push(
                `/(tabs)/(sessions)/reschedule/${session.id}` as any
              )
            }
          >

            <Ionicons
              name="calendar-outline"
              size={19}
              color="#FFFFFF"
            />


            <Text
              style={
                styles.rescheduleButtonText
              }
            >
              Reschedule Session
            </Text>

          </Pressable>

        )}


        {/* REVIEW */}

        {session.status === "completed" && (

          <Pressable
            style={
              styles.reviewButton
            }
            onPress={() =>
              router.push(
                `/(tabs)/(sessions)/review/${session.id}` as any
              )
            }
          >

            <Ionicons
              name="star-outline"
              size={19}
              color="#FFFFFF"
            />


            <Text
              style={
                styles.reviewButtonText
              }
            >
              Review Session
            </Text>

          </Pressable>

        )}

      </ScrollView>

    </>

  );

}


const styles =
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor: "#F7F8FC",
    },

    content: {
      padding: 16,
      paddingBottom: 40,
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F7F8FC",
    },

    messageText: {
      color: COLORS.textSecondary,
      fontSize: 16,
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

    actionSection: {
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },

    actionTitle: {
      color: COLORS.textPrimary,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 14,
    },

    actionButton: {
      minHeight: 50,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 10,
    },

    acceptButton: {
      backgroundColor: "#16A34A",
    },

    rejectButton: {
      backgroundColor: "#DC2626",
    },

    cancelButton: {
      backgroundColor: "#6B7280",
    },

    completeButton: {
      backgroundColor: "#2563EB",
    },

    actionButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
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

    reviewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 50,
      backgroundColor: "#F59E0B",
      borderRadius: 14,
      marginBottom: 20,
    },

    reviewButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },

    rescheduleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 50,
      backgroundColor: COLORS.primary,
      borderRadius: 14,
      marginBottom: 20,
    },

    rescheduleButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },

  });