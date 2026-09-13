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

export interface UpdateSessionRequest {
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";
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


export const getSessions = async () => {
  const response = await api.get(
    "/sessions"
  );

  return response.data;
};


export const getSessionById = async (
  id: string
) => {
  const response = await api.get(
    `/sessions/${id}`
  );

  return response.data;
};


export const updateSession = async (
  id: string,
  sessionData: UpdateSessionRequest
) => {
  const response = await api.patch(
    `/sessions/${id}`,
    sessionData
  );

  return response.data;
};