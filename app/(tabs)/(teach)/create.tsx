import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { createSkill } from "@/services/skillService";
import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;


const DURATIONS = [
  "30",
  "60",
  "90",
];


const MODES = [
  "Online",
  "In Person",
  "Both",
] as const;


const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


export default function CreateOfferScreen() {


  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [level, setLevel] =
    useState<(typeof LEVELS)[number]>("Beginner");

  const [duration, setDuration] =
    useState("60");

  const [mode, setMode] =
    useState<(typeof MODES)[number]>("Online");

  const [location, setLocation] = useState("");

  const [availableDays, setAvailableDays] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const toggleDay = (day: string) => {

    setAvailableDays((prev) =>
      prev.includes(day)
        ? prev.filter((item) => item !== day)
        : [...prev, day]
    );

  };


  const handleSubmit = async () => {

    setError("");


    if (title.trim().length < 3) {

      setError(
        "Skill title must contain at least 3 characters."
      );

      return;

    }


    if (category.trim().length === 0) {

      setError("Please enter a category.");

      return;

    }


    if (description.trim().length < 20) {

      setError(
        "Description must contain at least 20 characters."
      );

      return;

    }


    if (availableDays.length === 0) {

      setError(
        "Please select at least one available day."
      );

      return;

    }


    try {

      setLoading(true);


      await createSkill({

        mentorId: "u1",

        title: title.trim(),

        category: category.trim(),

        description: description.trim(),

        level,

        duration: Number(duration),

        mode,

        location: location.trim(),

        availableDays,

        rating: 0,

        isActive: true,

      });


      Alert.alert(
        "Success",
        "Your skill offer was created successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );


    } catch (error) {

      console.log(
        "CREATE SKILL ERROR:",
        error
      );

      setError(
        "Failed to create skill offer. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >


      <Text style={styles.heading}>
        Create Skill Offer
      </Text>


      <Text style={styles.subtitle}>
        Share a skill you can teach to other students.
      </Text>


      {error !== "" && (

        <View style={styles.errorBox}>

          <Text style={styles.errorText}>
            {error}
          </Text>

        </View>

      )}


      <Text style={styles.fieldLabel}>
        Skill Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. React Native Development"
        placeholderTextColor={COLORS.textLight}
        value={title}
        onChangeText={setTitle}
        editable={!loading}
        accessibilityLabel="Skill title"
      />


      <Text style={styles.fieldLabel}>
        Category
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Programming"
        placeholderTextColor={COLORS.textLight}
        value={category}
        onChangeText={setCategory}
        editable={!loading}
        accessibilityLabel="Skill category"
      />


      <Text style={styles.fieldLabel}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.multiline,
        ]}
        placeholder="Describe what you can teach..."
        placeholderTextColor={COLORS.textLight}
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        editable={!loading}
        accessibilityLabel="Skill description"
      />


      <Text style={styles.label}>
        Level
      </Text>


      <View style={styles.row}>

        {LEVELS.map((item) => (

          <Pressable
            key={item}
            style={[
              styles.option,
              level === item && styles.activeOption,
            ]}
            onPress={() => setLevel(item)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`${item} level`}
            accessibilityState={{
              selected: level === item,
            }}
          >

            <Text
              style={[
                styles.optionText,
                level === item && styles.activeOptionText,
              ]}
            >
              {item}
            </Text>

          </Pressable>

        ))}

      </View>


      <Text style={styles.label}>
        Duration
      </Text>


      <View style={styles.row}>

        {DURATIONS.map((item) => (

          <Pressable
            key={item}
            style={[
              styles.option,
              duration === item && styles.activeOption,
            ]}
            onPress={() => setDuration(item)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`${item} minute duration`}
            accessibilityState={{
              selected: duration === item,
            }}
          >

            <Text
              style={[
                styles.optionText,
                duration === item &&
                  styles.activeOptionText,
              ]}
            >
              {item} min
            </Text>

          </Pressable>

        ))}

      </View>


      <Text style={styles.label}>
        Mode
      </Text>


      <View style={styles.row}>

        {MODES.map((item) => (

          <Pressable
            key={item}
            style={[
              styles.option,
              mode === item && styles.activeOption,
            ]}
            onPress={() => setMode(item)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`${item} teaching mode`}
            accessibilityState={{
              selected: mode === item,
            }}
          >

            <Text
              style={[
                styles.optionText,
                mode === item && styles.activeOptionText,
              ]}
            >
              {item}
            </Text>

          </Pressable>

        ))}

      </View>


      <Text style={styles.fieldLabel}>
        Location
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Optional location"
        placeholderTextColor={COLORS.textLight}
        value={location}
        onChangeText={setLocation}
        editable={!loading}
        accessibilityLabel="Teaching location"
      />


      <Text style={styles.label}>
        Available Days
      </Text>

      <Text style={styles.helperText}>
        Select at least one day.
      </Text>


      <View style={styles.daysContainer}>

        {DAYS.map((day) => {

          const selected =
            availableDays.includes(day);

          return (

            <Pressable
              key={day}
              style={[
                styles.dayOption,
                selected && styles.activeDay,
              ]}
              onPress={() => toggleDay(day)}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={`${day} available`}
              accessibilityState={{
                selected,
              }}
            >

              <View
                style={[
                  styles.checkbox,
                  selected && styles.checkedBox,
                ]}
              >

                {selected && (
                  <Text style={styles.checkmark}>
                    ✓
                  </Text>
                )}

              </View>

              <Text
                style={[
                  styles.dayText,
                  selected && styles.activeDayText,
                ]}
              >
                {day}
              </Text>

            </Pressable>

          );

        })}

      </View>


      <Pressable
        style={[
          styles.submit,
          loading && styles.disabledSubmit,
        ]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Create skill offer"
        accessibilityHint="Creates your new skill offer"
      >

        {loading ? (

          <>

            <ActivityIndicator
              size="small"
              color={COLORS.white}
            />

            <Text style={styles.submitText}>
              Creating...
            </Text>

          </>

        ) : (

          <Text style={styles.submitText}>
            Create Offer
          </Text>

        )}

      </Pressable>


      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Cancel creating skill offer"
      >

        <Text style={styles.cancelText}>
          Cancel
        </Text>

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
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },


  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },


  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 7,
  },


  label: {
    marginTop: 17,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },


  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    fontSize: 14,
  },


  multiline: {
    height: 110,
    paddingTop: 13,
  },


  row: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },


  option: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },


  activeOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },


  optionText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },


  activeOptionText: {
    color: COLORS.white,
  },


  helperText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },


  daysContainer: {
    gap: 8,
  },


  dayOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },


  activeDay: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },


  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },


  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },


  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },


  dayText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },


  activeDayText: {
    color: COLORS.primary,
  },


  submit: {
    marginTop: 28,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },


  disabledSubmit: {
    opacity: 0.65,
  },


  submitText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },


  cancelButton: {
    marginTop: 10,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },


  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },


  errorBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 15,
  },


  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    lineHeight: 19,
  },

});