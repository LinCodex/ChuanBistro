export interface SurveyResults {
  food: string;
  service: string;
  atmosphere: string;
  rating: number;
  comments?: string;
}

const API_KEY = "AIzaSyAhM1cGz2J1GbJF5vyUomwsgNNXy2XWWFc";

export async function generateReview(
  results: SurveyResults,
  language: "en" | "cn" = "en",
): Promise<string> {
  const prompt = `
You are helping a real customer write a Google Maps review for "Chuan Bistro" in Flushing, NY.

Here is what the customer told us about their visit:
- They described the food as: ${results.food}
- They described the service as: ${results.service}
- They described the atmosphere/vibe as: ${results.atmosphere}
- Their overall rating: ${results.rating} out of 5
- Their own additional details: ${results.comments || "nothing specific mentioned"}

Write a review in ${language === "en" ? "English" : "Simplified Chinese"} that sounds like a normal, everyday person posting on Google Maps. NOT a food blogger, NOT an influencer, NOT a marketing person. Just a regular customer sharing their honest experience.

Critical rules you MUST follow:
1. NEVER use hyphens (-) or dashes anywhere in the review.
2. NEVER use emojis.
3. NEVER use over the top words like "incredible", "amazing", "absolutely", "game changer", "next level", "must try", "blown away", "obsessed", "divine", "exquisite", "impeccable", "phenomenal", "spectacular".
4. Use simple, conversational language. Think about how a normal person actually talks.
5. Keep it 3 to 5 sentences long.
6. If the customer mentioned specific dishes or details, naturally weave those in.
7. Make the tone match the rating. A 5 star review should be enthusiastic but real. A 3 star review should be balanced.
8. Every review must be unique. Vary sentence structure, opening lines, and phrasing. Do NOT start with "Went to" or "Visited" every time. Mix it up.
9. If writing in Chinese, refer to the restaurant as "川小叙".
10. Output ONLY the review text. No quotes, no labels, no extra formatting.
`;

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return (
      response.text?.trim() || "Something went wrong generating the review."
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === "en"
      ? "Error generating review. Please try again."
      : "生成评论时出错，请重试。";
  }
}
