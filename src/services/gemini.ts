import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SurveyResults {
  food: string;
  service: string;
  atmosphere: string;
  rating: number;
  comments?: string;
}

export async function generateReview(results: SurveyResults, language: 'en' | 'cn' = 'en') {
  const prompt = `
    You are a customer of "Chuan Bistro 三杯叙" in Flushing, NY.
    Based on the following experience metrics, write a short, authentic-sounding review.
    
    Metrics:
    - Food Quality: ${results.food}
    - Service: ${results.service}
    - Atmosphere: ${results.atmosphere}
    - Overall Star Rating (out of 5): ${results.rating}/5
    - Additional Comments: ${results.comments || 'None'}
    
    Requirements:
    - Language: ${language === 'en' ? 'English' : 'Chinese (Simplified)'}
    - Style: Friendly, helpful, and natural (avoid sounding like a robot).
    - Length: 2-3 sentences.
    - NEVER use hyphens or dashes (-) in the output.
    
    If Chinese, include the name "三杯叙".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "Something went wrong generating the review.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating review. Please try again.";
  }
}
