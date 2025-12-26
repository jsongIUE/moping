
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_BASE, getCategoryRules } from "./constants";
import { PaintingCategory, UserLevel } from "./types";

const API_KEY = process.env.API_KEY || "";

export const analyzePainting = async (
  imageData: string,
  category: PaintingCategory,
  level: UserLevel
) => {
  if (!API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const systemPrompt = `${SYSTEM_PROMPT_BASE}\n用户身份: ${level}\n指定画种: ${category}\n${getCategoryRules(category)}`;

  const prompt = `请分析这张国画作品。如果是自动识别，请先判断画种。`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(",")[1],
            },
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
};
