import { useRouter } from "expo-router";
import { useState } from "react";
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

import {
    requestPasswordReset,
} from "@/services/authService";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleResetRequest = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage(
        "Please enter your account email."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await requestPasswordReset(
          email.trim()
        );

      setSuccessMessage(
        response?.message ||
          "Your password reset request has been received."
      );
    } catch (error: any) {
      console.error(
        "Password reset request failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to process your request. Please try again.";

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
            Forgot Password?
          </Text>

          <Text style={styles.subtitle}>
            Enter the email address associated
            with your LearnLoop account.
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
              setSuccessMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={[
              styles.resetButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleResetRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={
                  styles.resetButtonText
                }
              >
                Request Password Reset
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.replace(
                "/auth/login"
              )
            }
          >
            <Text style={styles.backText}>
              ← Back to Login
            </Text>
          </Pressable>
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
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#666666",
    marginBottom: 28,
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
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },

  resetButton: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111111",
  },

  disabledButton: {
    opacity: 0.6,
  },

  resetButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "center",
    marginTop: 22,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
  },
});