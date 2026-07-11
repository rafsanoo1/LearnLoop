
import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { SKILL_OFFERS } from "@/data/skills";
import { router, useLocalSearchParams } from "expo-router";
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

export default function EditOfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = SKILL_OFFERS.find((item) => item.id === id);

  const [title, setTitle] = useState(offer?.title ?? "");
  const [category, setCategory] = useState(offer?.category ?? "");
  const [description, setDescription] = useState(
    offer?.description ?? ""
  );
  const [isActive, setIsActive] = useState(
    offer?.isActive ?? false
  );

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    description: "",
  });

  if (!offer) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Offer not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    const newErrors = {
      title:
        title.trim().length >= 3
          ? ""
          : "Title must contain at least 3 characters.",
      category: category.trim()
        ? ""
        : "Category is required.",
      description:
        description.trim().length >= 20
          ? ""
          : "Description must contain at least 20 characters.",
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(
      (error) => error === ""
    );

    if (!isValid) return;

    const message = "Your skill offer was updated successfully.";

    if (Platform.OS === "web") {
      window.alert(message);
      router.back();
      return;
    }

    Alert.alert("Offer Updated", message, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Edit Skill Offer</Text>

      <Text style={styles.label}>Skill Title</Text>
      <TextInput
        style={[
          styles.input,
          errors.title ? styles.inputError : null,
        ]}
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={COLORS.textLight}
      />

      {errors.title ? (
        <Text style={styles.errorText}>{errors.title}</Text>
      ) : null}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[
          styles.input,
          errors.category ? styles.inputError : null,
        ]}
        value={category}
        onChangeText={setCategory}
        placeholderTextColor={COLORS.textLight}
      />

      {errors.category ? (
        <Text style={styles.errorText}>{errors.category}</Text>
      ) : null}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          errors.description ? styles.inputError : null,
        ]}
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={300}
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.counter}>
        {description.length} / 300 characters
      </Text>

      {errors.description ? (
        <Text style={styles.errorText}>
          {errors.description}
        </Text>
      ) : null}

      <Text style={styles.label}>Offer Status</Text>

      <View style={styles.statusRow}>
        <Pressable
          style={[
            styles.statusButton,
            isActive && styles.statusButtonActive,
          ]}
          onPress={() => setIsActive(true)}
        >
          <Text
            style={[
              styles.statusText,
              isActive && styles.statusTextActive,
            ]}
          >
            Active
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.statusButton,
            !isActive && styles.statusButtonActive,
          ]}
          onPress={() => setIsActive(false)}
        >
          <Text
            style={[
              styles.statusText,
              !isActive && styles.statusTextActive,
            ]}
          >
            Paused
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginBottom: SPACING.md,
  },
  counter: {
    color: COLORS.textLight,
    fontSize: 11,
    textAlign: "right",
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statusButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  statusTextActive: {
    color: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  notFoundText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});