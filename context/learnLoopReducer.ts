import { SkillOffer } from "@/types/learnloop";
import { AppUser } from "@/services/userService";

export interface LearnLoopState {
  skills: SkillOffer[];
  skillsLoading: boolean;
  skillsError: string | null;

  selectedSkill: SkillOffer | null;
  selectedSkillLoading: boolean;
  selectedSkillError: string | null;

  users: Record<string, AppUser>;
  userLoading: boolean;
  userError: string | null;
}

export const initialLearnLoopState: LearnLoopState = {
  skills: [],
  skillsLoading: false,
  skillsError: null,

  selectedSkill: null,
  selectedSkillLoading: false,
  selectedSkillError: null,

  users: {},
  userLoading: false,
  userError: null,
};

export type LearnLoopAction =
  | {
      type: "SET_SKILLS_LOADING";
    }
  | {
      type: "SET_SKILLS_SUCCESS";
      payload: SkillOffer[];
    }
  | {
      type: "SET_SKILLS_ERROR";
      payload: string;
    }
  | {
      type: "SET_SELECTED_SKILL_LOADING";
    }
  | {
      type: "SET_SELECTED_SKILL_SUCCESS";
      payload: SkillOffer;
    }
  | {
      type: "SET_SELECTED_SKILL_ERROR";
      payload: string;
    }
  | {
      type: "CLEAR_SELECTED_SKILL";
    }
  | {
      type: "SET_USER_LOADING";
    }
  | {
      type: "SET_USER_SUCCESS";
      payload: AppUser;
    }
  | {
      type: "SET_USER_ERROR";
      payload: string;
    };

export const learnLoopReducer = (
  state: LearnLoopState,
  action: LearnLoopAction
): LearnLoopState => {
  switch (action.type) {
    case "SET_SKILLS_LOADING":
      return {
        ...state,
        skillsLoading: true,
        skillsError: null,
      };

    case "SET_SKILLS_SUCCESS":
      return {
        ...state,
        skills: action.payload,
        skillsLoading: false,
        skillsError: null,
      };

    case "SET_SKILLS_ERROR":
      return {
        ...state,
        skillsLoading: false,
        skillsError: action.payload,
      };

    case "SET_SELECTED_SKILL_LOADING":
      return {
        ...state,
        selectedSkillLoading: true,
        selectedSkillError: null,
      };

    case "SET_SELECTED_SKILL_SUCCESS":
      return {
        ...state,
        selectedSkill: action.payload,
        selectedSkillLoading: false,
        selectedSkillError: null,
      };

    case "SET_SELECTED_SKILL_ERROR":
      return {
        ...state,
        selectedSkill: null,
        selectedSkillLoading: false,
        selectedSkillError: action.payload,
      };

    case "CLEAR_SELECTED_SKILL":
      return {
        ...state,
        selectedSkill: null,
        selectedSkillLoading: false,
        selectedSkillError: null,
      };

    case "SET_USER_LOADING":
      return {
        ...state,
        userLoading: true,
        userError: null,
      };

    case "SET_USER_SUCCESS":
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload,
        },
        userLoading: false,
        userError: null,
      };

    case "SET_USER_ERROR":
      return {
        ...state,
        userLoading: false,
        userError: action.payload,
      };

    default:
      return state;
  }
};