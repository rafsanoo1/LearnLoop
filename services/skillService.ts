import { SkillOffer } from "@/types/learnloop";
import api from "./api";

interface ApiSkillOffer
  extends Omit<SkillOffer, "id"> {
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

export const getSkills = async (): Promise<
  SkillOffer[]
> => {
  const response = await api.get<ApiSkillOffer[]>(
    "/skills"
  );

  return response.data.map(normalizeSkill);
};

export const getSkillById = async (
  id: string
): Promise<SkillOffer> => {
  const response = await api.get<ApiSkillOffer>(
    `/skills/${id}`
  );

  return normalizeSkill(response.data);
};