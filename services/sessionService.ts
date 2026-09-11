import api from "./api";

export interface CreateSessionRequest {
  skillOfferId: string;
  learnerId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  creditCost: number;
  objective: string;
  mode: "Online" | "In Person";
}

export const createSession = async (
  sessionData: CreateSessionRequest
) => {
  const response = await api.post(
    "/sessions",
    sessionData
  );

  return response.data;
};