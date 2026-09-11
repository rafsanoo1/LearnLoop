import api from "./api";

export interface CreateSkillRequestData {
  requesterId: string;
  skillName: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mode: "Online" | "In Person" | "Either";
  learningGoal: string;
}

export const createSkillRequest = async (
  requestData: CreateSkillRequestData
) => {
  const response = await api.post(
    "/skill-requests",
    requestData
  );

  return response.data;
};