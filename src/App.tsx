/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ChevronRight,
  ArrowRight,
  RefreshCcw,
  Clipboard,
  ExternalLink,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Check,
  Languages,
} from "lucide-react";
import { generateReview, SurveyResults } from "./services/gemini";

// --- Types ---
type Step =
  | "welcome"
  | "survey"
  | "rating"
  | "comments"
  | "generating"
  | "result";

interface Option {
  label: string;
  value: string;
}

const SURVEY_OPTIONS: Record<string, Option[]> = {
  food: [
    { label: "Outstanding", value: "outstanding" },
    { label: "Delicious", value: "delicious" },
    { label: "Tasty", value: "tasty" },
  ],
  service: [
    { label: "Excellent", value: "excellent" },
    { label: "Attentive", value: "attentive" },
    { label: "Friendly", value: "friendly" },
  ],
  atmosphere: [
    { label: "Vibrant", value: "vibrant" },
    { label: "Cozy", value: "cozy" },
    { label: "Relaxing", value: "relaxing" },
  ],
};

const SUGGESTIONS = [
  "e.g., The Black Fungus With Wild Pepper was delicious...",
  "e.g., Really enjoyed the Blood Tofu With Pork Intestines...",
  "e.g., Braised Pork Tripe With Cordyceps Flowers & Dual Mushrooms was amazing...",
  "e.g., Loved the Braised String Beans And Eggplant...",
  "e.g., The Braised Turtle With Two Peppers was so unique...",
  "e.g., Brown Sugar Glutinous Rice Cake was the perfect dessert...",
  "e.g., The Cashew Celery was fresh and crunchy...",
  "e.g., Chive Flower Stir-Fried Fresh Squid was perfectly cooked...",
  "e.g., The Chongqing Spicy Chicken was flavorful and spicy...",
  "e.g., Cold Edamame was a great starter...",
  "e.g., The staff was very attentive...",
  "e.g., The waiter gave great recommendations...",
  "e.g., The service was incredibly fast...",
];

// --- Main App ---
export default function App() {
  const [step, setStep] = useState<Step>("welcome");
  const [results, setResults] = useState<SurveyResults>({
    food: "",
    service: "",
    atmosphere: "",
    rating: 5,
    comments: "",
  });

  const [reviews, setReviews] = useState<{ en: string; cn: string } | null>(
    null,
  );
  const [lang, setLang] = useState<"en" | "cn">("en");
  const [refreshCount, setRefreshCount] = useState(0);
  const [isCopying, setIsCopying] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [randomPlaceholder, setRandomPlaceholder] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

  const MAX_REFRESH = 5;

  const BACKGROUND_IMAGES = [
    "/2025-12-30.webp",
    "/unnamed.webp",
    "/unnamed_1.webp",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * SUGGESTIONS.length);
    setRandomPlaceholder(SUGGESTIONS[randomIdx]);

    // Select 4 random suggestions excluding the one used as placeholder
    const available = SUGGESTIONS.filter((_, i) => i !== randomIdx);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 4));
  }, []);

  const handleOptionSelect = (key: keyof SurveyResults, value: any) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setStep("generating");
    const [en, cn] = await Promise.all([
      generateReview(results, "en"),
      generateReview(results, "cn"),
    ]);
    setReviews({ en, cn });
    setStep("result");
  };

  const handleRefresh = async () => {
    if (refreshCount >= MAX_REFRESH) return;
    setStep("generating");
    const [en, cn] = await Promise.all([
      generateReview(results, "en"),
      generateReview(results, "cn"),
    ]);
    setReviews({ en, cn });
    setRefreshCount((prev) => prev + 1);
    setStep("result");
  };

  const copyToClipboard = () => {
    const text = reviews ? (lang === "en" ? reviews.en : reviews.cn) : "";
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleRedirect = () => {
    copyToClipboard();
    setShowRedirectModal(true);
  };

  const confirmRedirect = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Chuan+Bistro+135-21A+37th+Ave+Flushing+NY+11354",
      "_blank",
    );
    setShowRedirectModal(false);
  };

  useEffect(() => {
    // Inject fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-[#eaeaeb] text-[#1A1A1A] font-sans selection:bg-[#E60000] selection:text-white overflow-x-hidden w-full transition-colors duration-500">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 z-0 bg-[#eaeaeb] overflow-hidden">
        {/* Maroon Blob 1 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1.1, 1],
            x: [0, -100, 50, 0],
            y: [0, 150, -50, 0],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-20%] w-[100vw] sm:w-[90vw] md:w-[80vw] aspect-square rounded-[40%_60%_70%_30%] bg-gradient-to-tr from-[#CC0000] via-[#990000] to-transparent blur-[90px] sm:blur-[120px] opacity-[0.9]"
        />

        {/* Maroon Blob 2 */}
        <motion.div
          animate={{
            scale: [1, 1.3, 0.9, 1],
            x: [0, 150, -80, 0],
            y: [0, -100, 120, 0],
            rotate: [360, 180, 90, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-30%] w-[90vw] sm:w-[80vw] md:w-[70vw] aspect-square rounded-[60%_40%_30%_70%] bg-gradient-to-bl from-[#CC0000] via-[#990000] to-transparent blur-[100px] sm:blur-[130px] opacity-[0.8]"
        />

        {/* Deep dark spot in the very corner for contrast */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-15%] w-[70vw] sm:w-[60vw] md:w-[45vw] aspect-square rounded-full bg-[#4D0000] blur-[90px] opacity-[0.8]"
        />

        {/* Subtle warm tint left/bottom for depth */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-30%] left-[-20%] w-[90vw] sm:w-[70vw] aspect-square rounded-full bg-[#d6cdc8] blur-[120px] opacity-[0.5]"
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        />
      </div>

      <main
        className="relative z-10 max-w-md sm:max-w-lg md:max-w-2xl mx-auto h-[100dvh] flex flex-col"
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(1.5rem, env(safe-area-inset-left))",
          paddingRight: "max(1.5rem, env(safe-area-inset-right))",
        }}
      >
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden pb-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start w-full mix-blend-difference text-[white]/80">
                <div className="font-semibold tracking-[0.2em] leading-snug text-[10px] sm:text-xs uppercase pt-2">
                  <p>Chuan Bistro</p>
                  <p>Review</p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-center text-white shadow-lg mix-blend-normal z-20">
                  <span className="text-xl sm:text-2xl font-semibold">叙</span>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Big Text Group */}
              <div className="flex justify-between items-end mb-8 sm:mb-10 w-full pl-2">
                <div className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#78716C] pb-2">
                  {new Date().getFullYear()}
                </div>
                <div className="text-right">
                  <h1 className="text-[40px] sm:text-[56px] md:text-[64px] tracking-tight text-[#111111] leading-[1.05]">
                    <span className="block font-medium">CRAFT</span>
                    <span className="block font-medium">YOUR PERFECT</span>
                    <span className="block font-bold">REVIEW</span>
                  </h1>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex w-full">
                <button
                  onClick={() => setStep("survey")}
                  className="relative overflow-hidden w-full rounded-full bg-[#111111] text-white py-5 sm:py-6 transition-all duration-500 active:scale-[0.98] group font-bold uppercase tracking-[0.2em] text-xs sm:text-sm flex items-center justify-center gap-3 border border-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E60000] to-[#CC0000] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  <span className="whitespace-nowrap z-10">Start Crafting</span>
                  
                  <div className="w-6 h-5 relative z-10 flex items-center justify-center shrink-0">
                    <motion.div
                      animate={{ x: [-3, 3, -3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </motion.div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Survey Step */}
          {step === "survey" && (
            <motion.div
              key="survey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col py-4 justify-between max-w-xl mx-auto w-full"
            >
              <header className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] text-center mt-4">
                  How was it?
                </h2>
                <div className="h-1.5 bg-[#E7E5E4] rounded-full overflow-hidden max-w-xs mx-auto w-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: results.atmosphere ? "100%" : "50%" }}
                    className="h-full bg-[#E60000]"
                  />
                </div>
              </header>

              <div className="space-y-6 sm:space-y-8 my-auto py-2">
                {["food", "service", "atmosphere"].map((key) => (
                  <div
                    key={key}
                    className="bg-white/60 backdrop-blur-xl border border-white/80 p-5 rounded-3xl shadow-lg shadow-black/5 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E60000]/10 flex items-center justify-center text-[#E60000] font-bold text-sm">
                        {key === "food" ? "1" : key === "service" ? "2" : "3"}
                      </div>
                      <label className="text-lg font-bold tracking-tight text-[#1A1A1A] capitalize">
                        {key === "food" ? "Food Quality" : key}
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SURVEY_OPTIONS[key].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            handleOptionSelect(
                              key as keyof SurveyResults,
                              opt.value,
                            )
                          }
                          className={`flex-1 min-w-[30%] h-12 px-3 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center text-center leading-tight border-2 ${
                            results[key as keyof SurveyResults] === opt.value
                              ? "bg-[#E60000] border-[#E60000] text-white shadow-md shadow-[#E60000]/20"
                              : "bg-white/50 border-white hover:border-[#E60000]/30 hover:bg-white text-[#57534E]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-auto">
                <button
                  disabled={
                    !results.food || !results.service || !results.atmosphere
                  }
                  onClick={() => setStep("rating")}
                  className="w-full bg-[#1A1A1A] text-white py-4 sm:py-5 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm hover:shadow-2xl hover:shadow-[#E60000]/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 transition-all duration-500 hover:bg-[#E60000]"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Rating Step */}
          {step === "rating" && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col py-4 justify-between max-w-xl mx-auto w-full"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] text-center mt-4">
                Overall Rating
              </h2>

              <div className="my-auto w-full flex flex-col justify-center items-center space-y-12">
                <div className="flex gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleOptionSelect("rating", star)}
                      className="p-1 sm:p-2 transition-transform active:scale-125 hover:scale-110 relative"
                    >
                      <Star className="w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 text-[#E7E5E4]" />
                      <div
                        className="absolute inset-0 p-1 sm:p-2 pointer-events-none"
                        style={{
                          clipPath: `inset(0 ${100 - Math.max(0, Math.min(100, (Number(results.rating) - (star - 1)) * 100))}% 0 0)`,
                        }}
                      >
                        <Star className="w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 text-[#F59E0B] fill-[#F59E0B] drop-shadow-md" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="w-full max-w-md mx-auto space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.01"
                    value={results.rating}
                    onChange={(e) =>
                      handleOptionSelect("rating", parseFloat(e.target.value))
                    }
                    className="w-full h-3 bg-white border border-white/50 shadow-inner rounded-full appearance-none cursor-pointer accent-[#E60000]"
                  />
                  <div className="flex justify-between text-xs text-[#78716C] font-semibold uppercase tracking-widest">
                    <span>Needs Work</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  onClick={() => setStep("comments")}
                  className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-[#E60000]/20 transition-all duration-500 hover:bg-[#E60000]"
                >
                  Add Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Comments Step */}
          {step === "comments" && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col py-4 justify-between max-w-xl mx-auto w-full space-y-4"
            >
              <div className="space-y-2 mt-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] text-center mt-4">
                  Anything else?
                </h2>
                <p className="text-sm text-[#78716C] text-center">
                  Mention specific dishes or staff members (optional)
                </p>
              </div>

              <div className="flex-1 flex flex-col min-h-[150px] my-2">
                <textarea
                  value={results.comments}
                  onChange={(e) =>
                    handleOptionSelect("comments", e.target.value)
                  }
                  placeholder={randomPlaceholder}
                  className="flex-1 w-full p-6 bg-white/80 backdrop-blur-md border-2 border-white focus:bg-white rounded-[2rem] outline-none focus:border-[#E60000]/50 transition-all duration-300 resize-none text-lg shadow-sm focus:shadow-md"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {(suggestions || []).map((suggestion, idx) => {
                  const suggestionText = (suggestion || "")
                    .replace("e.g., ", "")
                    .replace("...", "");
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const newComments = results.comments
                          ? `${results.comments}, ${suggestionText}`
                          : suggestionText;
                        handleOptionSelect("comments", newComments);
                      }}
                      className="px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm text-[13px] text-[#57534E] font-medium rounded-full hover:bg-white hover:text-[#1A1A1A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-white/50 cursor-pointer"
                    >
                      + {suggestionText}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-auto">
                <button
                  onClick={handleGenerate}
                  className="w-full bg-[#E60000] text-white py-4 sm:py-5 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#CC0000] hover:shadow-2xl hover:shadow-[#E60000]/30 transition-all duration-500 shadow-lg shadow-[#E60000]/20 hover:-translate-y-0.5"
                >
                  Generate Review
                </button>
              </div>
            </motion.div>
          )}

          {/* Generating Step */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center items-center space-y-8"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.img
                  animate={{
                    rotate: [-15, 15, -15],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  src="/chili.svg"
                  alt="Loading animation"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-medium">Crafting your review...</p>
                <p className="text-sm text-[#78716C]">
                  Personalizing based on your feedback
                </p>
              </div>
            </motion.div>
          )}

          {/* Result Step */}
          {step === "result" && reviews && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col py-4 justify-between space-y-4 max-w-2xl mx-auto w-full"
            >
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  Your Review
                </h2>
                <button
                  onClick={() => setLang(lang === "en" ? "cn" : "en")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F3F2F1] rounded-full text-sm font-medium hover:bg-[#E7E5E4] transition-colors"
                >
                  <Languages className="w-4 h-4 sm:w-5" />
                  {lang === "en" ? "中文" : "English"}
                </button>
              </div>

              <div className="relative group flex-1 flex flex-col">
                <textarea
                  value={lang === "en" ? reviews.en : reviews.cn}
                  onChange={(e) => {
                    if (reviews) {
                      setReviews({ ...reviews, [lang]: e.target.value });
                    }
                  }}
                  className="flex-1 bg-white/80 backdrop-blur-md p-6 sm:p-8 pr-14 sm:pr-16 rounded-[2rem] border-2 border-white focus:bg-white shadow-lg leading-relaxed text-[#44403C] text-lg sm:text-xl min-h-[160px] sm:min-h-[200px] outline-none focus:border-[#E60000]/50 transition-all duration-300 resize-none w-full block scrollbar-hide focus:shadow-xl"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-md border hover:border-[#E60000] hover:bg-[#E60000] hover:text-white transition-all active:scale-95 text-[#57534E]"
                >
                  {isCopying ? (
                    <Check className="w-5 h-5 text-green-500 hover:text-white" />
                  ) : (
                    <Clipboard className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <p className="text-sm font-medium text-[#78716C]">
                    Refreshes:{" "}
                    <span
                      className={
                        refreshCount >= MAX_REFRESH ? "text-red-500" : ""
                      }
                    >
                      {refreshCount}/{MAX_REFRESH}
                    </span>
                  </p>
                  {refreshCount >= MAX_REFRESH && (
                    <p className="text-[10px] uppercase tracking-tighter text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full">
                      Limit reached
                    </p>
                  )}
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={refreshCount >= MAX_REFRESH}
                  className="w-full flex items-center justify-center gap-2 font-medium text-base sm:text-lg text-[#78716C] hover:text-[#E60000] disabled:opacity-30 p-2 transition-colors"
                >
                  <RefreshCcw
                    className={`w-4 h-4 sm:w-5 ${refreshCount < MAX_REFRESH && "group-hover:rotate-180 transition-transform duration-500"}`}
                  />
                  Not quite right? Regenerate
                </button>

                <div className="w-full pt-2 mt-auto">
                  <button
                    onClick={handleRedirect}
                    className="w-full bg-[#E60000] text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#E60000]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Post to Google Maps
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Redirect Confirmation Modal */}
      <AnimatePresence>
        {showRedirectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Review Copied!</h3>
                <p className="text-[#78716C]">
                  We're opening Google Maps for you. Simply paste your review in
                  the comment box.
                </p>
              </div>
              <button
                onClick={confirmRedirect}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-medium"
              >
                Go to Google Maps
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
