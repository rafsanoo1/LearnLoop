import api from "./api";


export interface CreateSkillRequestData {

  requesterId: string;

  skillName: string;

  category: string;

  level: "Beginner" | "Intermediate" | "Advanced";

  mode: "Online" | "In Person" | "Either";

  learningGoal: string;

}


// Student 1 creates request
export const createSkillRequest = async (

  requestData: CreateSkillRequestData

) => {

  const response = await api.post(

    "/skill-requests",

    requestData

  );

  return response.data;

};



// Student 2 gets all requested skills
export const getSkillRequests = async () => {

  const response = await api.get(

    "/skill-requests"

  );

  return response.data;

};



// Student 2 accepts/rejects request
export const updateSkillRequestStatus = async (

  id: string,

  status: "matched" | "closed"

) => {

  const response = await api.patch(

    `/skill-requests/${id}`,

    {
      status,
    }

  );

  return response.data;

};