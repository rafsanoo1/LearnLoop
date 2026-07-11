
import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RequestStatus = "Pending" | "Accepted" | "Declined";

interface TeachingRequest {
  id: string;
  studentName: string;
  skillTitle: string;
  date: string;
  time: string;
  duration: number;
  mode: string;
  objective: string;
  status: RequestStatus;
}

const INITIAL_REQUESTS: TeachingRequest[] = [
  {
    id: "request-1",
    studentName: "Nadia Rahman",
    skillTitle: "React Native Basics",
    date: "18 July 2026",
    time: "7:00 PM",
    duration: 60,
    mode: "Online",
    objective:
      "I want to understand components, props, state and basic navigation.",
    status: "Pending",
  },
  {
    id: "request-2",
    studentName: "Tanvir Ahmed",
    skillTitle: "Java Programming",
    date: "20 July 2026",
    time: "5:30 PM",
    duration: 90,
    mode: "In Person",
    objective:
      "I need help understanding object-oriented programming and inheritance.",
    status: "Pending",
  },
];

export default function IncomingRequestsScreen() {
  const [requests, setRequests] =
    useState<TeachingRequest[]>(INITIAL_REQUESTS);

  const updateStatus = (
    requestId: string,
    status: RequestStatus
  ) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? { ...request, status }
          : request
      )
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Incoming Requests</Text>

      <Text style={styles.subtitle}>
        Review session requests from students who want to learn
        your skills.
      </Text>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="mail-open-outline"
            size={45}
            color={COLORS.textLight}
          />

          <Text style={styles.emptyTitle}>No requests yet</Text>

          <Text style={styles.emptyText}>
            New teaching requests will appear here.
          </Text>
        </View>
      ) : (
        requests.map((request) => (
          <View key={request.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {request.studentName.charAt(0)}
                </Text>
              </View>

              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>
                  {request.studentName}
                </Text>

                <Text style={styles.skillTitle}>
                  {request.skillTitle}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  request.status === "Accepted" &&
                    styles.acceptedBadge,
                  request.status === "Declined" &&
                    styles.declinedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    request.status === "Accepted" &&
                      styles.acceptedText,
                    request.status === "Declined" &&
                      styles.declinedText,
                  ]}
                >
                  {request.status}
                </Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>
                  {request.date}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>
                  {request.time} · {request.duration} min
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
            </View>

            <Text style={styles.objectiveLabel}>
              Learning objective
            </Text>

            <Text style={styles.objective}>
              {request.objective}
            </Text>

            {request.status === "Pending" ? (
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.declineButton}
                  onPress={() =>
                    updateStatus(request.id, "Declined")
                  }
                >
                  <Text style={styles.declineButtonText}>
                    Decline
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.acceptButton}
                  onPress={() =>
                    updateStatus(request.id, "Accepted")
                  }
                >
                  <Text style={styles.acceptButtonText}>
                    Accept
                  </Text>
                </Pressable>
              </View>
            ) : null}
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
    color: COLORS.textPrimary,
    fontSize: 25,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  studentInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  studentName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  skillTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  acceptedBadge: {
    backgroundColor: "#DCFCE7",
  },
  declinedBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: "700",
  },
  acceptedText: {
    color: COLORS.success,
  },
  declinedText: {
    color: COLORS.danger,
  },
  detailsContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  detailText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  objectiveLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  objective: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  declineButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
  },
  declineButtonText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  acceptButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: SPACING.xs,
  },
});