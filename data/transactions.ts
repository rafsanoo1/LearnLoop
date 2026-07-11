import { CreditTransaction } from "@/types/learnloop";

export const TRANSACTIONS: CreditTransaction[] = [
  {
    id: "t1",
    userId: "u1",
    sessionId: "session3",
    type: "earned",
    amount: 1,
    description: "Taught React Native with Expo",
    date: "2026-07-09",
  },
  {
    id: "t2",
    userId: "u1",
    sessionId: "session1",
    type: "spent",
    amount: 1,
    description: "Booked Figma UI Design session",
    date: "2026-07-14",
  },
  {
    id: "t3",
    userId: "u1",
    type: "bonus",
    amount: 1,
    description: "Starter credit",
    date: "2026-07-01",
  },
  {
    id: "t4",
    userId: "u1",
    sessionId: "session2",
    type: "spent",
    amount: 1,
    description: "Booked Python for Machine Learning session",
    date: "2026-07-18",
  },
  {
    id: "t5",
    userId: "u1",
    sessionId: "session4",
    type: "earned",
    amount: 0.5,
    description: "English Speaking Practice session",
    date: "2026-07-20",
  },
];