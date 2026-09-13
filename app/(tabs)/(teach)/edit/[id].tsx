import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";

import {
  getSkillById,
  updateSkill,
} from "@/services/skillService";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

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


export default function EditOfferScreen() {


  const { id } =
    useLocalSearchParams<{ id: string }>();


  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [level, setLevel] =
    useState<(typeof LEVELS)[number]>("Beginner");

  const [duration, setDuration] =
    useState("60");

  const [mode, setMode] =
    useState<(typeof MODES)[number]>("Online");

  const [location, setLocation] =
    useState("");

  const [availableDays, setAvailableDays] =
    useState<string[]>([]);

  const [isActive, setIsActive] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadSkill = async () => {

      try {

        setLoading(true);
        setError("");


        const skill =
          await getSkillById(id!);


        setTitle(skill.title ?? "");

        setCategory(skill.category ?? "");

        setDescription(skill.description ?? "");

        setLevel(
          skill.level ?? "Beginner"
        );

        setDuration(
          String(skill.duration ?? 60)
        );

        setMode(
          skill.mode ?? "Online"
        );

        setLocation(
          skill.location ?? ""
        );

        setAvailableDays(
          skill.availableDays ?? []
        );

        setIsActive(
          skill.isActive ?? true
        );


      } catch (error) {

        console.log(
          "Load skill error:",
          error
        );

        setError(
          "Failed to load skill offer."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {
      loadSkill();
    }

  }, [id]);


  const toggleDay = (day: string) => {

    setAvailableDays((prev) =>
      prev.includes(day)
        ? prev.filter(
            (item) => item !== day
          )
        : [...prev, day]
    );

  };


  const handleSave = async () => {

    setError("");


    if (title.trim().length < 3) {

      setError(
        "Skill title must contain at least 3 characters."
      );

      return;

    }


    if (category.trim().length === 0) {

      setError(
        "Please enter a category."
      );

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

      setSaving(true);


      await updateSkill(

        id!,

        {

          title: title.trim(),

          category: category.trim(),

          description: description.trim(),

          level,

          duration: Number(duration),

          mode,

          location: location.trim(),

          availableDays,

          isActive,

        }

      );


      Alert.alert(

        "Success",

        "Your skill offer was updated successfully.",

        [

          {

            text: "OK",

            onPress: () => {

              router.replace(
                "/(tabs)/(teach)"
              );

            },

          },

        ]

      );


    } catch (error) {

      console.log(
        "Update error:",
        error
      );

      setError(
        "Failed to update skill offer. Please try again."
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (

      <View style={styles.center}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading skill offer...
        </Text>

      </View>

    );

  }


  if (error && !title) {

    return (

      <View style={styles.center}>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => router.back()}
        >

          <Text style={styles.retryText}>
            Go Back
          </Text>

        </Pressable>

      </View>

    );

  }


  return (

    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >


      <Text style={styles.heading}>
        Edit Skill Offer
      </Text>


      <Text style={styles.subtitle}>
        Update the details of your skill offer.
      </Text>


      {error !== "" && (

        <View style={styles.errorBox}>

          <Text style={styles.errorText}>
            {error}
          </Text>

        </View>

      )}


      <Text style={styles.label}>
        Skill Title
      </Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Skill title"
        placeholderTextColor={COLORS.textLight}
        editable={!saving}
      />


      <Text style={styles.label}>
        Category
      </Text>

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
        placeholderTextColor={COLORS.textLight}
        editable={!saving}
      />


      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your skill..."
        placeholderTextColor={COLORS.textLight}
        multiline
        textAlignVertical="top"
        editable={!saving}
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
              level === item &&
                styles.activeOption,
            ]}
            onPress={() => setLevel(item)}
            disabled={saving}
          >

            <Text
              style={[
                styles.optionText,
                level === item &&
                  styles.activeOptionText,
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
              duration === item &&
                styles.activeOption,
            ]}
            onPress={() => setDuration(item)}
            disabled={saving}
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
              mode === item &&
                styles.activeOption,
            ]}
            onPress={() => setMode(item)}
            disabled={saving}
          >

            <Text
              style={[
                styles.optionText,
                mode === item &&
                  styles.activeOptionText,
              ]}
            >
              {item}
            </Text>

          </Pressable>

        ))}

      </View>


      <Text style={styles.label}>
        Location
      </Text>

      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Optional location"
        placeholderTextColor={COLORS.textLight}
        editable={!saving}
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
                selected &&
                  styles.activeDay,
              ]}
              onPress={() =>
                toggleDay(day)
              }
              disabled={saving}
            >

              <View
                style={[
                  styles.checkbox,
                  selected &&
                    styles.checkedBox,
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
                  selected &&
                    styles.activeDayText,
                ]}
              >
                {day}
              </Text>

            </Pressable>

          );

        })}

      </View>


      <Text style={styles.label}>
        Status
      </Text>


      <View style={styles.row}>

        <Pressable
          style={[
            styles.statusButton,
            isActive &&
              styles.activeStatus,
          ]}
          onPress={() =>
            setIsActive(true)
          }
          disabled={saving}
        >

          <Text
            style={[
              styles.statusText,
              isActive &&
                styles.activeStatusText,
            ]}
          >
            Active
          </Text>

        </Pressable>


        <Pressable
          style={[
            styles.statusButton,
            !isActive &&
              styles.pausedStatus,
          ]}
          onPress={() =>
            setIsActive(false)
          }
          disabled={saving}
        >

          <Text
            style={[
              styles.statusText,
              !isActive &&
                styles.pausedStatusText,
            ]}
          >
            Paused
          </Text>

        </Pressable>

      </View>


      <Pressable
        style={[
          styles.saveButton,
          saving &&
            styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >

        {saving ? (

          <>

            <ActivityIndicator
              size="small"
              color={COLORS.white}
            />

            <Text style={styles.saveText}>
              Saving...
            </Text>

          </>

        ) : (

          <Text style={styles.saveText}>
            Save Changes
          </Text>

        )}

      </Pressable>


      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={saving}
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
  },


  label: {
    marginTop: 15,
    marginBottom: 7,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },


  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },


  textArea: {
    height: 120,
    textAlignVertical: "top",
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


  statusButton: {
    flex: 1,
    padding: 13,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.md,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },


  activeStatus: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },


  pausedStatus: {
    backgroundColor: "#FEF3C7",
    borderColor: COLORS.warning,
  },


  statusText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },


  activeStatusText: {
    color: COLORS.white,
  },


  pausedStatusText: {
    color: COLORS.warning,
  },


  saveButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },


  disabledButton: {
    opacity: 0.65,
  },


  saveText: {
    color: COLORS.white,
    fontWeight: "700",
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
    marginBottom: 10,
  },


  errorText: {
    color: COLORS.danger,
    textAlign: "center",
  },


  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: COLORS.background,
  },


  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
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

});