import SkillCard from "@/components/skill-card";
import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { USERS } from "@/data/users";
import { SkillOffer } from "@/types/learnloop";
import { useState } from "react";
import { router } from "expo-router";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchSkillsScreen() {
  const [query, setQuery] = useState("");

  const filteredSkills = SKILL_OFFERS.filter((skill) => {
    const searchText = query.toLowerCase();

    return (
      skill.isActive &&
      (skill.title.toLowerCase().includes(searchText) ||
        skill.category.toLowerCase().includes(searchText) ||
        skill.description.toLowerCase().includes(searchText))
    );
  });

  const getMentorName = (mentorId: string) =>
    USERS.find((user) => user.id === mentorId)?.name ?? "Unknown Mentor";

  const handleSkillPress = (skill: SkillOffer) => {
  router.push({
    pathname: "/(tabs)/(discover)/skill/[id]",
    params: { id: skill.id },
    });
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search skills or categories..."
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filteredSkills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillCard
            skill={item}
            mentorName={getMentorName(item.mentorId)}
            onPress={handleSkillPress}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No skills found for “{query}”
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});