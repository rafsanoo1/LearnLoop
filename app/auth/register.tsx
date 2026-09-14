import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import {
  registerUser,
} from "@/services/authService";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !studentId.trim() ||
      !department.trim() ||
      !semester.trim()
    ) {
      setErrorMessage(
        "Please complete all fields."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        studentId: studentId.trim(),
        department: department.trim(),
        semester: semester.trim(),
      });

      setSuccessMessage(
        "Registration successful. Redirecting to login..."
      );

      // Clear the form after successful registration.
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setStudentId("");
      setDepartment("");
      setSemester("");

      // Give the user a moment to see the success message,
      // then send them to the login screen.
      setTimeout(() => {
        router.replace("/auth/login");
      }, 800);
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create your account. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.logo}>
            LearnLoop
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join the community and start
            exchanging skills.
          </Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                {successMessage}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setErrorMessage("");
            }}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrorMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrorMessage("");
            }}
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrorMessage("");
            }}
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            Student ID
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 22-48348-3"
            placeholderTextColor="#888"
            value={studentId}
            onChangeText={(value) => {
              setStudentId(value);
              setErrorMessage("");
            }}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>
            Department
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Computer Science"
            placeholderTextColor="#888"
            value={department}
            onChangeText={(value) => {
              setDepartment(value);
              setErrorMessage("");
            }}
          />

          <Text style={styles.label}>
            Semester
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 12"
            placeholderTextColor="#888"
            value={semester}
            onChangeText={(value) => {
              setSemester(value);
              setErrorMessage("");
            }}
            keyboardType="numeric"
          />

          <Pressable
            style={[
              styles.registerButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={
                  styles.registerButtonText
                }
              >
                Create Account
              </Text>
            )}
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/auth/login"
                )
              }
            >
              <Text
                style={
                  styles.loginLink
                }
              >
                Log In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
    elevation: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#666666",
    marginBottom: 26,
  },

  errorBox: {
    backgroundColor: "#ffe8e8",
    borderWidth: 1,
    borderColor: "#e5a0a0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  successBox: {
    backgroundColor: "#e8f7ed",
    borderWidth: 1,
    borderColor: "#9ad6ad",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  successText: {
    color: "#18723a",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#d6d9df",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },

  registerButton: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111111",
    marginTop: 6,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 22,
  },

  loginText: {
    fontSize: 14,
    color: "#666666",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});