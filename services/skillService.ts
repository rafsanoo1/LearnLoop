
import { SkillOffer } from "@/types/learnloop";
import api from "./api";

interface ApiSkillOffer extends Omit<SkillOffer, "id"> {
  _id: string;
}

const normalizeSkill = (
  skill: ApiSkillOffer
): SkillOffer => {
  return {
    id: skill._id,
    mentorId: skill.mentorId,
    title: skill.title,
    category: skill.category,
    description: skill.description,
    level: skill.level,
    duration: skill.duration,
    mode: skill.mode,
    location: skill.location,
    availableDays: skill.availableDays,
    rating: skill.rating,
    isActive: skill.isActive,
  };
};

// GET ALL SKILLS
export const getSkills = async (): Promise<SkillOffer[]> => {
  const response = await api.get<ApiSkillOffer[]>(
    "/skills"
  );

  return response.data.map(normalizeSkill);
};

// GET SINGLE SKILL
export const getSkillById = async (
  id: string
): Promise<SkillOffer> => {
  const response = await api.get<ApiSkillOffer>(
    `/skills/${id}`
  );

  return normalizeSkill(response.data);
};

// CREATE SKILL
export const createSkill = async (
  skillData: Omit<SkillOffer, "id">
): Promise<SkillOffer> => {
  const response = await api.post<ApiSkillOffer>(
    "/skills",
    skillData
  );

  return normalizeSkill(response.data);
};

// UPDATE SKILL
export const updateSkill = async (
  id: string,
  skillData: Partial<Omit<SkillOffer, "id">>
): Promise<SkillOffer> => {
  const response = await api.patch<ApiSkillOffer>(
    `/skills/${id}`,
    skillData
  );

  return normalizeSkill(response.data);
};

// DELETE SKILL
export const deleteSkill = async (
  id: string
) => {
  const response = await api.delete(
    `/skills/${id}`
  );

  return response.data;
};