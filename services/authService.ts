import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const AUTH_USER_KEY = "@learnloop_auth_user";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  studentId: string;
  department: string;
  semester: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  semester: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
}

export const registerUser = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response =
    await api.post<AuthResponse>(
      "/auth/register",
      data
    );

  // Registration does NOT authenticate the user.
  // The user must log in after creating the account.

  return response.data;
};

export const loginUser = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      data
    );

  await AsyncStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(response.data.user)
  );

  return response.data;
};

export const getStoredAuthUser =
  async (): Promise<AuthUser | null> => {
    const storedUser =
      await AsyncStorage.getItem(
        AUTH_USER_KEY
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser
      ) as AuthUser;
    } catch {
      await AsyncStorage.removeItem(
        AUTH_USER_KEY
      );

      return null;
    }
  };

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    await AsyncStorage.removeItem(
      AUTH_USER_KEY
    );
  }
};

export const requestPasswordReset = async (
  email: string
) => {
  const response =
    await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

  return response.data;
};