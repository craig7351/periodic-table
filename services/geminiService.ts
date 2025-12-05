import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, PeriodicElement } from "../types";
import { VILLAGER_PERSONAS } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVillagerExplanation = async (element: PeriodicElement): Promise<string> => {
  try {
    const ai = getClient();
    const persona = VILLAGER_PERSONAS[Math.floor(Math.random() * VILLAGER_PERSONAS.length)];
    
    const prompt = `
      Tell me about the chemical element ${element.name} (Symbol: ${element.symbol}, Atomic Number: ${element.number}).
      Keep it under 60 words.
      
      Constraint: ${persona}
      Language: Traditional Chinese (Taiwan).
      Use cute emojis. End with a catchphrase typical of Animal Crossing style.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "我想不到要說什麼，抱歉！掰掰！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "噢！我的腦袋感覺毛毛的。現在記不起來那個元素。啪嗒！";
  }
};

export const generateQuizQuestion = async (topic?: string): Promise<QuizQuestion> => {
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
    
    return JSON.parse(text) as QuizQuestion;

  } catch (error) {
    console.error("Quiz Gen Error:", error);
    // Fallback question
    return {
      question: "鑽石的主要成分是哪種元素？",
      options: ["金", "銀", "碳", "鐵"],
      correctAnswerIndex: 2,
      explanation: "鑽石是由純碳以晶格排列組成的！閃亮亮！"
    };
  }
};