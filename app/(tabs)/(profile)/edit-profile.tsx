import { useLearnLoop } from "@/context/LearnLoopContext";
import { COLORS } from "@/constants/learnloop-theme";
import {
  getUserById,
  AppUser,
} from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CURRENT_USER_ID = "u1";

export default function EditProfileScreen() {
  const router = useRouter();

  const { updateCurrentUser } =
    useLearnLoop();

  const [currentUser, setCurrentUser] =
    useState<AppUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [name, setName] = useState("");
  const [department, setDepartment] =
    useState("");
  const [semester, setSemester] =
    useState("");
  const [bio, setBio] = useState("");
  const [teachSkills, setTeachSkills] =
    useState("");
  const [learnSkills, setLearnSkills] =
    useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    department?: string;
    semester?: string;
  }>({});

  // LOAD REAL USER FROM BACKEND
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const user =
          await getUserById(
            CURRENT_USER_ID
          );

        setCurrentUser(user);

        setName(user.name);
        setDepartment(user.department);
        setSemester(user.semester);
        setBio(user.bio);

        setTeachSkills(
          user.teachSkills.join(", ")
        );

        setLearnSkills(
          user.learnSkills.join(", ")
        );
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        showMessage(
          "Error",
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      department?: string;
      semester?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name =
        "Name is required.";
    }

    if (!department.trim()) {
      newErrors.department =
        "Department is required.";
    }

    if (!semester.trim()) {
      newErrors.semester =
        "Semester is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const showMessage = (
    title: string,
    message: string
  ) => {
    if (Platform.OS === "web") {
      window.alert(
        `${title}\n\n${message}`
      );
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      /*
       * Update through LearnLoopContext.
       *
       * This sends the PATCH request to the backend
       * and also updates the Context state so that
       * the Profile screen immediately receives the
       * updated user.
       */
      const updatedUser =
        await updateCurrentUser({
          name: name.trim(),

          department:
            department.trim(),

          semester:
            semester.trim(),

          bio: bio.trim(),

          teachSkills:
            teachSkills
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter(Boolean),

          learnSkills:
            learnSkills
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter(Boolean),
        });

      setCurrentUser(updatedUser);

      if (Platform.OS === "web") {
        window.alert(
          "Profile updated successfully."
        );

        router.back();
      } else {
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully.",
          [
            {
              text: "OK",
              onPress: () =>
                router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      showMessage(
        "Update Failed",
        "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>
          Profile not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profile",
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
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={32}
              color={COLORS.primary}
            />
          </View>

          <View
            style={
              styles.headerTextContainer
            }
          >
            <Text style={styles.title}>
              Edit Profile
            </Text>

            <Text style={styles.subtitle}>
              Update your personal and
              learning information.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {/* FULL NAME */}
          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);

              if (errors.name) {
                setErrors((previous) => ({
                  ...previous,
                  name: undefined,
                }));
              }
            }}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              errors.name &&
                styles.inputError,
            ]}
          />

          {errors.name ? (
            <Text
              style={styles.errorText}
            >
              {errors.name}
            </Text>
          ) : null}

          {/* STUDENT ID */}
          <Text style={styles.label}>
            Student ID
          </Text>

          <TextInput
            value={
              currentUser.studentId
            }
            editable={false}
            style={[
              styles.input,
              styles.disabledInput,
            ]}
          />

          <Text
            style={styles.helperText}
          >
            Student ID cannot be changed.
          </Text>

          {/* DEPARTMENT */}
          <Text style={styles.label}>
            Department
          </Text>

          <TextInput
            value={department}
            onChangeText={(text) => {
              setDepartment(text);

              if (errors.department) {
                setErrors((previous) => ({
                  ...previous,
                  department: undefined,
                }));
              }
            }}
            placeholder="Enter your department"
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              errors.department &&
                styles.inputError,
            ]}
          />

          {errors.department ? (
            <Text
              style={styles.errorText}
            >
              {errors.department}
            </Text>
          ) : null}

          {/* SEMESTER */}
          <Text style={styles.label}>
            Semester
          </Text>

          <TextInput
            value={semester}
            onChangeText={(text) => {
              setSemester(text);

              if (errors.semester) {
                setErrors((previous) => ({
                  ...previous,
                  semester: undefined,
                }));
              }
            }}
            placeholder="Example: 7th Semester"
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              errors.semester &&
                styles.inputError,
            ]}
          />

          {errors.semester ? (
            <Text
              style={styles.errorText}
            >
              {errors.semester}
            </Text>
          ) : null}

          {/* BIO */}
          <Text style={styles.label}>
            Bio
          </Text>

          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell others about yourself"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textArea,
            ]}
          />

          {/* TEACH SKILLS */}
          <Text style={styles.label}>
            Skills I Teach
          </Text>

          <TextInput
            value={teachSkills}
            onChangeText={setTeachSkills}
            placeholder="Example: React Native, Figma"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <Text
            style={styles.helperText}
          >
            Separate multiple skills
            with commas.
          </Text>

          {/* LEARN SKILLS */}
          <Text style={styles.label}>
            Skills I Want to Learn
          </Text>

          <TextInput
            value={learnSkills}
            onChangeText={setLearnSkills}
            placeholder="Example: Python, Public Speaking"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <Text
            style={styles.helperText}
          >
            Separate multiple skills
            with commas.
          </Text>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                router.back()
              }
              disabled={saving}
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                saving &&
                  styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="save-outline"
                  size={18}
                  color="#FFFFFF"
                />
              )}

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
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

  avatar: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 29,
    marginRight: 14,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 13,
  },

  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: COLORS.textSecondary,
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 11,
    marginTop: 5,
  },

  helperText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
    marginBottom: 4,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },

  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
    padding: 20,
  },

  notFoundTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },

  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});