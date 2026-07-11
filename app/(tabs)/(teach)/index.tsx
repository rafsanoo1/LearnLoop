
import OfferCard from "@/components/offer-card";
import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { SkillOffer } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TeachScreen() {
  const myOffers = SKILL_OFFERS.filter(
    (offer) => offer.mentorId === "u1"
  );

  const handleEdit = (offer: SkillOffer) => {
    router.push({
      pathname: "/(tabs)/(teach)/edit/[id]",
      params: { id: offer.id },
    });
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={myOffers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OfferCard offer={item} onEdit={handleEdit} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My Skill Offers</Text>

            <Text style={styles.subtitle}>
              Manage the skills you offer to other students.
            </Text>

            <Pressable
              style={styles.createButton}
              onPress={() =>
                router.push("/(tabs)/(teach)/create")
              }
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={COLORS.white}
              />

              <Text style={styles.createButtonText}>
                Create New Offer
              </Text>
            </Pressable>

            <Pressable
              style={styles.requestsButton}
              onPress={() =>
                router.push(
                  "/(tabs)/(teach)/incoming-requests"
                )
              }
            >
              <Ionicons
                name="mail-unread-outline"
                size={20}
                color={COLORS.primary}
              />

              <Text style={styles.requestsButtonText}>
                View Incoming Requests
              </Text>
            </Pressable>

            <Text style={styles.sectionTitle}>
              {myOffers.length} offers
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You have not created any skill offers yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  header: {
    marginBottom: SPACING.md,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginBottom: SPACING.md,
  },

  createButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  requestsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    marginBottom: SPACING.lg,
  },

  requestsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    padding: SPACING.xl,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});