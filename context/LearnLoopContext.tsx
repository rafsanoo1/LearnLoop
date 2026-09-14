import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  getSkillById as fetchSkillById,
  getSkills as fetchSkills,
} from "@/services/skillService";

import {
  AppUser,
  getUserById as fetchUserById,
  updateUser as updateUserApi,
  UpdateUserRequest,
} from "@/services/userService";

import {
  AuthUser,
  getStoredAuthUser,
  LoginRequest,
  loginUser,
  logoutUser as logoutAuthUser,
} from "@/services/authService";

import {
  initialLearnLoopState,
  learnLoopReducer,
  LearnLoopState,
} from "@/context/learnLoopReducer";

interface LearnLoopContextValue {
  state: LearnLoopState;

  authUser: AuthUser | null;
  authLoading: boolean;

  login: (
    data: LoginRequest
  ) => Promise<AuthUser>;

  loadSkills: () => Promise<void>;

  loadSkillById: (
    id: string
  ) => Promise<void>;

  clearSelectedSkill: () => void;

  loadUserById: (
    id: string
  ) => Promise<void>;

  loadCurrentUser: () => Promise<void>;

  updateCurrentUser: (
    userData: UpdateUserRequest
  ) => Promise<AppUser>;

  logout: () => Promise<void>;
}

const LearnLoopContext =
  createContext<
    LearnLoopContextValue | undefined
  >(undefined);

interface LearnLoopProviderProps {
  children: ReactNode;
}

export function LearnLoopProvider({
  children,
}: LearnLoopProviderProps) {
  const [state, dispatch] = useReducer(
    learnLoopReducer,
    initialLearnLoopState
  );

  const [authUser, setAuthUser] =
    useState<AuthUser | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const login = async (
    data: LoginRequest
  ): Promise<AuthUser> => {
    const response =
      await loginUser(data);

    setAuthUser(response.user);

    return response.user;
  };

  const loadSkills = async () => {
    dispatch({
      type: "SET_SKILLS_LOADING",
    });

    try {
      const skills =
        await fetchSkills();

      dispatch({
        type: "SET_SKILLS_SUCCESS",
        payload: skills,
      });
    } catch (error) {
      console.error(
        "Failed to load skills:",
        error
      );

      dispatch({
        type: "SET_SKILLS_ERROR",
        payload:
          "Unable to load skills. Please try again.",
      });
    }
  };

  const loadSkillById = async (
    id: string
  ) => {
    dispatch({
      type: "SET_SELECTED_SKILL_LOADING",
    });

    try {
      const skill =
        await fetchSkillById(id);

      dispatch({
        type:
          "SET_SELECTED_SKILL_SUCCESS",
        payload: skill,
      });
    } catch (error) {
      console.error(
        "Failed to load skill:",
        error
      );

      dispatch({
        type:
          "SET_SELECTED_SKILL_ERROR",
        payload:
          "Unable to load this skill. Please try again.",
      });
    }
  };

  const clearSelectedSkill = () => {
    dispatch({
      type: "CLEAR_SELECTED_SKILL",
    });
  };

  const loadUserById = async (
    id: string
  ) => {
    if (state.users[id]) {
      return;
    }

    dispatch({
      type: "SET_USER_LOADING",
    });

    try {
      const user =
        await fetchUserById(id);

      dispatch({
        type: "SET_USER_SUCCESS",
        payload: user,
      });
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      dispatch({
        type: "SET_USER_ERROR",
        payload:
          "Unable to load user information.",
      });
    }
  };

  const loadCurrentUser = async () => {
    if (state.currentUser) {
      return;
    }

    if (!authUser) {
      return;
    }

    dispatch({
      type: "SET_CURRENT_USER_LOADING",
    });

    try {
      const user =
        await fetchUserById(
          authUser.id
        );

      dispatch({
        type:
          "SET_CURRENT_USER_SUCCESS",
        payload: user,
      });
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      dispatch({
        type:
          "SET_CURRENT_USER_ERROR",
        payload:
          "Unable to load current user information.",
      });
    }
  };

  const updateCurrentUser = async (
    userData: UpdateUserRequest
  ): Promise<AppUser> => {
    if (!authUser) {
      throw new Error(
        "No authenticated user."
      );
    }

    try {
      const updatedUser =
        await updateUserApi(
          authUser.id,
          userData
        );

      dispatch({
        type:
          "SET_CURRENT_USER_SUCCESS",
        payload: updatedUser,
      });

      return updatedUser;
    } catch (error) {
      console.error(
        "Failed to update current user:",
        error
      );

      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutAuthUser();
    } finally {
      setAuthUser(null);

      dispatch({
        type: "CLEAR_CURRENT_USER",
      });
    }
  };

  useEffect(() => {
    const restoreAuthentication =
      async () => {
        try {
          const storedUser =
            await getStoredAuthUser();

          setAuthUser(storedUser);
        } catch (error) {
          console.error(
            "Failed to restore authentication:",
            error
          );

          setAuthUser(null);
        } finally {
          setAuthLoading(false);
        }
      };

    void restoreAuthentication();
  }, []);

  useEffect(() => {
    if (!authLoading && authUser) {
      void loadCurrentUser();
    }
  }, [authLoading, authUser]);

  return (
    <LearnLoopContext.Provider
      value={{
        state,
        authUser,
        authLoading,
        login,
        loadSkills,
        loadSkillById,
        clearSelectedSkill,
        loadUserById,
        loadCurrentUser,
        updateCurrentUser,
        logout,
      }}
    >
      {children}
    </LearnLoopContext.Provider>
  );
}

export function useLearnLoop() {
  const context =
    useContext(LearnLoopContext);

  if (!context) {
    throw new Error(
      "useLearnLoop must be used inside LearnLoopProvider"
    );
  }

  return context;
}