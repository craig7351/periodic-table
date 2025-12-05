export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
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
