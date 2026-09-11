import api from "./api";

export interface AppUser {
  id: string;
  name: string;
  studentId: string;
  department: string;
  semester: string;
  bio: string;
  avatarUrl: string;
  teachSkills: string[];
  learnSkills: string[];
  creditBalance: number;
  rating: number;
  completedSessions: number;
}

interface ApiUser {
  _id: string;
  name: string;
  studentId: string;
  department: string;
  semester: string;
  bio: string;
  avatarUrl: string;
  teachSkills: string[];
  learnSkills: string[];
  creditBalance: number;
  rating: number;
  completedSessions: number;
}

const normalizeUser = (
  user: ApiUser
): AppUser => {
  return {
    id: user._id,
    name: user.name,
    studentId: user.studentId,
    department: user.department,
    semester: user.semester,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    teachSkills: user.teachSkills,
    learnSkills: user.learnSkills,
    creditBalance: user.creditBalance,
    rating: user.rating,
    completedSessions: user.completedSessions,
  };
};

export const getUserById = async (
  id: string
): Promise<AppUser> => {
  const response = await api.get<ApiUser>(
    `/users/${id}`
  );

  return normalizeUser(response.data);
};