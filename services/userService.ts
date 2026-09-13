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

export interface UpdateUserRequest {
  name: string;
  department: string;
  semester: string;
  bio: string;
  teachSkills: string[];
  learnSkills: string[];
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


// GET USER BY ID
export const getUserById = async (
  id: string
): Promise<AppUser> => {
  const response = await api.get<ApiUser>(
    `/users/${id}`
  );

  return normalizeUser(response.data);
};


// UPDATE USER PROFILE
export const updateUser = async (
  id: string,
  userData: UpdateUserRequest
): Promise<AppUser> => {
  const response = await api.patch<ApiUser>(
    `/users/${id}`,
    userData
  );

  return normalizeUser(response.data);
};