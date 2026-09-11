import {
    createContext,
    ReactNode,
    useContext,
    useReducer,
} from "react";

import {
    getSkillById as fetchSkillById,
    getSkills as fetchSkills,
} from "@/services/skillService";

import {
    getUserById as fetchUserById,
} from "@/services/userService";

import {
    initialLearnLoopState,
    learnLoopReducer,
    LearnLoopState,
} from "@/context/learnLoopReducer";

interface LearnLoopContextValue {
  state: LearnLoopState;

  loadSkills: () => Promise<void>;

  loadSkillById: (
    id: string
  ) => Promise<void>;

  clearSelectedSkill: () => void;

  loadUserById: (
    id: string
  ) => Promise<void>;
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

  return (
    <LearnLoopContext.Provider
      value={{
        state,
        loadSkills,
        loadSkillById,
        clearSelectedSkill,
        loadUserById,
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