import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./constant";

export const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export const GEMINI_MODEL = "gemini-3.5-flash";