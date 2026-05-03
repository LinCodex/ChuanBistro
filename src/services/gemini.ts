export interface SurveyResults {
  food: string;
  service: string;
  atmosphere: string;
  rating: number;
  comments?: string;
}

// Read the key from either the Vite-standard `VITE_GEMINI_API_KEY` or the
// legacy `process.env.GEMINI_API_KEY` (kept working via vite.config `define`).
// Both are static-replaced at build time so this is safe to run anywhere.
function getApiKey(): string {
  const viteKey =
    (import.meta as ImportMeta).env?.VITE_GEMINI_API_KEY as string | undefined;
  const procKey =
    typeof process !== "undefined" && process.env
      ? (process.env.GEMINI_API_KEY as string | undefined)
      : undefined;
  return viteKey || procKey || "";
}

export async function generateReview(
  results: SurveyResults,
  language: "en" | "cn" = "en",
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    // No throw — return a friendly message so the UI keeps working.
    console.warn(
      "[gemini] No API key configured. Set VITE_GEMINI_API_KEY (or GEMINI_API_KEY) in your deploy environment.",
    );
    return language === "en"
      ? "AI is not configured for this deployment yet. Add a Gemini API key to enable review generation."
      : "AI 服务尚未配置。请添加 Gemini API 密钥后再生成评论。";
  }

  const prompt = `
    You are a customer of "Chuan Bistro 三杯叙" in Flushing, NY.
    Based on the following experience metrics, write a short, authentic-sounding review.

    Metrics:
    - Food Quality: ${results.food}
    - Service: ${results.service}
    - Atmosphere: ${results.atmosphere}
    - Overall Star Rating (out of 5): ${results.rating}/5
    - Additional Comments: ${results.comments || "None"}

    Requirements:
    - Language: ${language === "en" ? "English" : "Chinese (Simplified)"}
    - Style: Friendly, helpful, and natural (avoid sounding like a robot).
    - Length: 2-3 sentences.
    - NEVER use hyphens or dashes (-) in the output.

    If Chinese, include the name "三杯叙".
  `;

  try {
    // Dynamic import keeps the ~150KB SDK out of the initial bundle —
    // it only loads when the user reaches the "generating" step.
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
