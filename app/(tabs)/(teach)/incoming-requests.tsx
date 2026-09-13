import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";

import {
  getSkillRequests,
  updateSkillRequestStatus,
} from "@/services/skillRequestService";

import { Ionicons } from "@expo/vector-icons";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";



interface SkillRequest {

  _id: string;

  requesterId: string;

  skillName: string;

  category: string;

  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced";

  mode:
    | "Online"
    | "In Person"
    | "Either";

  learningGoal: string;

  status:
    | "open"
    | "matched"
    | "closed";

}



export default function IncomingRequestsScreen() {


  const [requests, setRequests] =
    useState<SkillRequest[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState("");


  const [updatingId, setUpdatingId] =
    useState<string | null>(null);




  const loadRequests = async () => {

    try {

      setError("");

      const data =
        await getSkillRequests();

      setRequests(data);

    } catch (err) {

      console.log(
        "Load request error:",
        err
      );

      setError(
        "Failed to load incoming requests. Please try again."
      );

    }

  };




  const initialLoad = async () => {

    try {

      setLoading(true);

      await loadRequests();

    } finally {

      setLoading(false);

    }

  };




  useEffect(() => {

    initialLoad();

  }, []);




  const handleRefresh = useCallback(
    async () => {

      try {

        setRefreshing(true);

        await loadRequests();

      } finally {

        setRefreshing(false);

      }

    },
    []
  );




  const changeStatus = async (
    id: string,
    status: "matched" | "closed"
  ) => {

    try {

      setUpdatingId(id);

      setError("");

      await updateSkillRequestStatus(
        id,
        status
      );

      await loadRequests();

      Alert.alert(
        "Success",
        status === "matched"
          ? "Request accepted successfully."
          : "Request declined successfully."
      );

    } catch (error) {

      console.log(
        "Update request error:",
        error
      );

      Alert.alert(
        "Update failed",
        "Could not update this request. Please try again."
      );

    } finally {

      setUpdatingId(null);

    }

  };




  if (loading) {

    return (

      <View style={styles.center}>

        <Ionicons
          name="hourglass-outline"
          size={35}
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading incoming requests...
        </Text>

      </View>

    );

  }




  if (error && requests.length === 0) {

    return (

      <View style={styles.center}>

        <Ionicons
          name="alert-circle-outline"
          size={45}
          color={COLORS.danger}
        />

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={initialLoad}
          accessibilityRole="button"
          accessibilityLabel="Retry loading incoming requests"
          accessibilityHint="Attempts to load incoming skill requests again"
        >

          <Text style={styles.retryText}>
            Retry
          </Text>

        </Pressable>

      </View>

    );

  }




  return (

    <ScrollView

      style={styles.screen}

      contentContainerStyle={styles.content}

      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }

    >


      <Text style={styles.heading}>
        Incoming Requests
      </Text>


      <Text style={styles.subtitle}>
        Review students who want to learn your skills.
      </Text>




      {error !== "" && requests.length > 0 && (

        <View style={styles.warningBox}>

          <Ionicons
            name="warning-outline"
            size={18}
            color={COLORS.warning}
          />

          <Text style={styles.warningText}>
            {error}
          </Text>

        </View>

      )}




      {requests.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Ionicons
            name="mail-open-outline"
            size={45}
            color={COLORS.textLight}
          />

          <Text style={styles.emptyTitle}>
            No requests yet
          </Text>

          <Text style={styles.emptyText}>
            New requests will appear here.
          </Text>

        </View>

      ) : (

        requests.map((request) => (

          <View
            key={request._id}
            style={styles.card}
          >


            <View style={styles.cardHeader}>


              <View style={styles.avatar}>

                <Text style={styles.avatarText}>

                  {String(request.requesterId)
                    .charAt(0)
                    .toUpperCase()}

                </Text>

              </View>




              <View style={styles.studentInfo}>

                <Text style={styles.studentName}>

                  Student {request.requesterId}

                </Text>

                <Text style={styles.skillTitle}>

                  {request.skillName}

                </Text>

              </View>




              <View
                style={[
                  styles.statusBadge,

                  request.status === "matched" &&
                    styles.acceptedBadge,

                  request.status === "closed" &&
                    styles.closedBadge,
                ]}
              >

                <Text
                  style={[
                    styles.statusText,

                    request.status === "matched" &&
                      styles.acceptedText,

                    request.status === "closed" &&
                      styles.closedText,
                  ]}
                >

                  {request.status}

                </Text>

              </View>


            </View>




            <View style={styles.detailItem}>

              <Ionicons
                name="book-outline"
                size={17}
                color={COLORS.primary}
              />

              <Text style={styles.detailText}>
                {request.category}
              </Text>

            </View>




            <View style={styles.detailItem}>

              <Ionicons
                name="school-outline"
                size={17}
                color={COLORS.primary}
              />

              <Text style={styles.detailText}>
                {request.level}
              </Text>

            </View>




            <View style={styles.detailItem}>

              <Ionicons
                name={
                  request.mode === "Online"
                    ? "videocam-outline"
                    : "location-outline"
                }
                size={17}
                color={COLORS.primary}
              />

              <Text style={styles.detailText}>
                {request.mode}
              </Text>

            </View>




            <Text style={styles.objectiveLabel}>
              Learning Goal
            </Text>


            <Text style={styles.objective}>
              {request.learningGoal}
            </Text>




            {request.status === "open" && (

              <View style={styles.actionRow}>


                <Pressable

                  style={[
                    styles.declineButton,

                    updatingId === request._id &&
                      styles.disabledButton,
                  ]}

                  disabled={updatingId !== null}

                  onPress={() =>
                    changeStatus(
                      request._id,
                      "closed"
                    )
                  }

                  accessibilityRole="button"

                  accessibilityLabel={
                    `Decline request for ${request.skillName}`
                  }

                  accessibilityHint={
                    "Closes this student's skill request"
                  }

                >

                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color={COLORS.danger}
                  />

                  <Text style={styles.declineText}>

                    {updatingId === request._id
                      ? "Updating..."
                      : "Decline"}

                  </Text>

                </Pressable>




                <Pressable

                  style={[
                    styles.acceptButton,

                    updatingId === request._id &&
                      styles.disabledButton,
                  ]}

                  disabled={updatingId !== null}

                  onPress={() =>
                    changeStatus(
                      request._id,
                      "matched"
                    )
                  }

                  accessibilityRole="button"

                  accessibilityLabel={
                    `Accept request for ${request.skillName}`
                  }

                  accessibilityHint={
                    "Accepts this student's skill request"
                  }

                >

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={COLORS.white}
                  />

                  <Text style={styles.acceptText}>

                    {updatingId === request._id
                      ? "Updating..."
                      : "Accept"}

                  </Text>

                </Pressable>


              </View>

            )}


          </View>

        ))

      )}


    </ScrollView>

  );

}




const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },


  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },


  subtitle: {
    marginTop: 5,
    marginBottom: 20,
    color: COLORS.textSecondary,
  },


  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },


  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },


  avatar: {
    width: 42,
    height: 42,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },


  avatarText: {
    color: COLORS.primary,
    fontWeight: "800",
  },


  studentInfo: {
    flex: 1,
    marginLeft: 10,
  },


  studentName: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },


  skillTitle: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },


  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
  },


  acceptedBadge: {
    backgroundColor: "#DCFCE7",
  },


  closedBadge: {
    backgroundColor: "#FEE2E2",
  },


  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
    textTransform: "capitalize",
  },


  acceptedText: {
    color: COLORS.success,
  },


  closedText: {
    color: COLORS.danger,
  },


  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },


  detailText: {
    color: COLORS.textSecondary,
  },


  objectiveLabel: {
    marginTop: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },


  objective: {
    marginTop: 5,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },


  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },


  declineButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    flexDirection: "row",
    gap: 6,
  },


  declineText: {
    color: COLORS.danger,
    fontWeight: "700",
  },


  acceptButton: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    flexDirection: "row",
    gap: 6,
  },


  acceptText: {
    color: COLORS.white,
    fontWeight: "700",
  },


  disabledButton: {
    opacity: 0.55,
  },


  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },


  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 15,
    color: COLORS.textPrimary,
  },


  emptyText: {
    color: COLORS.textSecondary,
    marginTop: 5,
  },


  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: COLORS.background,
  },


  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
  },


  errorText: {
    marginTop: 12,
    color: COLORS.danger,
    textAlign: "center",
  },


  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },


  retryText: {
    color: COLORS.white,
    fontWeight: "700",
  },


  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FEF3C7",
  },


  warningText: {
    flex: 1,
    color: COLORS.warning,
    fontSize: 13,
  },

});