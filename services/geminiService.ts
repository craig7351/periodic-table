import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, PeriodicElement } from "../types";
import { VILLAGER_NOTES } from "../villagerNotes";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVillagerExplanation = async (element: PeriodicElement): Promise<string> => {
  console.log(`[Villager Service] Fetching static note for element: ${element.name} (${element.symbol})`);
  
  // Lookup in static database
  const noteData = VILLAGER_NOTES.find(n => n.element === element.symbol);
  
  if (noteData) {
    // Randomly select one of the 3 notes
    const options = [noteData.note_1, noteData.note_2, noteData.note_3];
    const selectedNote = options[Math.floor(Math.random() * options.length)];
    return selectedNote;
  }
  
  // Fallback if not found in static data (should not happen for standard 118 elements)
  return "噢！我的腦袋感覺毛毛的。現在記不起來那個元素。啪嗒！";
};

export const generateQuizQuestion = async (topic?: string): Promise<QuizQuestion> => {
  console.log(`[Gemini Service] Generating quiz question for topic: ${topic || "Random"}`);
  try {
    const ai = getClient();
    
    // Schema definition for structured JSON output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The quiz question text in Traditional Chinese." },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "4 possible answers in Traditional Chinese." 
        },
        correctAnswerIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct answer." },
        explanation: { type: Type.STRING, description: "A short, cute explanation of why it is correct in Traditional Chinese." },
      },
      required: ["question", "options", "correctAnswerIndex", "explanation"],
    };

    const prompt = `
      Generate a multiple choice question about the Periodic Table of Elements.
      ${topic ? `Focus on: ${topic}.` : "Focus on general elemental facts, symbols, or groups."}
      
      Style: Animal Crossing / Cute / Fun.
      Language: Traditional Chinese (Taiwan).
      Difficulty: Beginner to Intermediate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    console.log(`[Gemini Service] Quiz question generated successfully`);
    return JSON.parse(text) as QuizQuestion;

  } catch (error) {
    console.error("[Gemini Service] Quiz Gen Error:", error);
    // Fallback question
    return {
      question: "鑽石的主要成分是哪種元素？",
      options: ["金", "銀", "碳", "鐵"],
      correctAnswerIndex: 2,
      explanation: "鑽石是由純碳以晶格排列組成的！閃亮亮！"
    };
  }
};