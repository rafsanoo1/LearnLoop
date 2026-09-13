
import { COLORS } from "@/constants/learnloop-theme";
import { SESSIONS } from "@/data/sessions";
import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SessionReviewScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const session = SESSIONS.find(
    (item) => item.id === id,
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (comment.trim().length < 10) {
      setError(
        "Please write at least 10 characters about the session.",
      );
      return;
    }

    setError("");

    const message =
      "Your review has been submitted successfully.";

    if (Platform.OS === "web") {
      window.alert(message);
      router.back();
      return;
    }

    Alert.alert(
      "Review Submitted",
      message,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ],
    );
  };

  if (!session) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen
          options={{
            title: "Session Review",
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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Session Review",
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="star-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.headerInformation}>
            <Text style={styles.heading}>
              Rate Your Session
            </Text>

            <Text style={styles.subheading}>
              Share your experience and help improve
              LearnLoop's peer-learning community.
            </Text>
          </View>
        </View>

        <View style={styles.sessionCard}>
          <Text style={styles.sectionTitle}>
            Session Information
          </Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              {session.scheduledDate}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              {session.scheduledTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="hourglass-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              {session.duration} minutes
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name={
                session.mode === "Online"
                  ? "videocam-outline"
                  : "location-outline"
              }
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              {session.mode}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              Status
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {session.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.sectionTitle}>
            Your Rating
          </Text>

          <Text style={styles.label}>
            How would you rate this session?
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                style={styles.starButton}
                onPress={() => {
                  setRating(star);
                  setError("");
                }}
              >
                <Ionicons
                  name={
                    star <= rating
                      ? "star"
                      : "star-outline"
                  }
                  size={36}
                  color={
                    star <= rating
                      ? "#F59E0B"
                      : COLORS.textSecondary
                  }
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.ratingText}>
            {rating === 0
              ? "Select a rating"
              : `${rating} out of 5`}
          </Text>

          <Text style={styles.label}>
            Review Comment
          </Text>

          <TextInput
            value={comment}
            onChangeText={(text) => {
              setComment(text);
              setError("");
            }}
            placeholder="What did you think about the session?"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={300}
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Text style={styles.characterCount}>
            {comment.length}/300 characters
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color="#B91C1C"
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Review Summary
            </Text>

            <Text style={styles.summaryText}>
              Rating:{" "}
              {rating > 0
                ? `${rating}/5`
                : "Not selected"}
            </Text>

            <Text style={styles.summaryText}>
              Session: {session.scheduledDate} at{" "}
              {session.scheduledTime}
            </Text>

            <Text style={styles.summaryText}>
              Mode: {session.mode}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Ionicons
                name="send-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.submitButtonText}>
                Submit Review
              </Text>
            </Pressable>
          </View>
        </View>
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
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 40,
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  headerIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    marginRight: 14,
  },

  headerInformation: {
    flex: 1,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },

  subheading: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  sessionCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  reviewCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  infoText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },

  statusLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  statusBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  starButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 22,
  },

  textArea: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 13,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  characterCount: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: "right",
    marginTop: 5,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 11,
    marginLeft: 7,
  },

  summaryCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    padding: 15,
    marginTop: 20,
  },

  summaryTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },

  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  submitButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  submitButtonText: {
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
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});