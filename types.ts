
export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  englishName: string; // Added for English quiz
  atomic_mass: number;
  category: string;
  xpos: number;
  ypos: number;
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LocalQuizQuestion {
  題目: string;
  選項: string[];
  答案: string; // "A", "B", "C", "D"
}

export type GuestbookTag = "一般留言" | "問題回報" | "許願功能";

export interface GuestMessage {
  id?: string;
  name: string;
  content: string;
  tag?: GuestbookTag; // New field
  timestamp: any; // Firestore timestamp
  avatar?: string; // Optional villager avatar emoji
}

export type AppView = 'table' | 'quiz' | 'detail';

export enum ElementCategory {
  ALKALI_METAL = 'alkali-metal',
  ALKALINE_EARTH_METAL = 'alkaline-earth-metal',
  TRANSITION_METAL = 'transition-metal',
  POST_TRANSITION_METAL = 'post-transition-metal',
  METALLOID = 'metalloid',
  NONMETAL = 'polyatomic nonmetal', // Simplified grouping
  NOBLE_GAS = 'noble-gas',
  LANTHANIDE = 'lanthanide',
  ACTINIDE = 'actinide',
  UNKNOWN = 'unknown',
}
