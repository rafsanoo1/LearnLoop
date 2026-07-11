export interface User {
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

export interface SkillOffer {
  id: string;
  mentorId: string;
  title: string;
  category: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  mode: "Online" | "In Person" | "Both";
  location?: string;
  availableDays: string[];
  rating: number;
  isActive: boolean;
}

export interface SkillSession {
  id: string;
  skillOfferId: string;
  mentorId: string;
  learnerId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  creditCost: number;
  objective: string;
  mode: "Online" | "In Person";
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";
}

export interface CreditTransaction {
  id: string;
  userId: string;
  sessionId?: string;
  type: "earned" | "spent" | "bonus" | "refund";
  amount: number;
  description: string;
  date: string;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  date: string;
}