require("dotenv").config();
const axios = require("axios");

// Utility: Detect gibberish-like content
function isGibberish(text) {
  const words = text.split(/\s+/);
  let gibberishCount = 0;

  for (const word of words) {
    if (word.length < 4 || !/^[a-zA-Z]+$/.test(word)) {
      gibberishCount++;
    }
  }

  const ratio = gibberishCount / (words.length || 1);
  return ratio > 0.2;
}

// Utility: Check if output is too short
function isTooShort(text) {
  return text.split(/\s+/).length < 15;
}

// Utility: Ensure it has relevant job-related words
function hasCommonWords(text) {
  const keywords = ["job", "skills", "role", "responsibility", "experience", "intern"];
  return keywords.some((word) => text.toLowerCase().includes(word));
}

// Utility: Clean up HTML tags or surrounding noise
function cleanOutput(text) {
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

// Main: Call HuggingFace Flan-T5 Model (merged version)
async function generateResponse(prompt) {
  const HF_API_KEY = process.env.HF_API_KEY;
  const endpoint = "https://api-inference.huggingface.co/models/pavithracp1909/flan-t5-lora-skills-chatbot";

  try {
    const response = await axios.post(
      endpoint,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data?.[0]?.generated_text;
    return output || "⚠️ Hugging Face returned empty";
  } catch (error) {
    const err = error.response?.data?.error;
    if (err && (err.includes("currently loading") || err.includes("is not ready"))) {
      console.warn("⏳ HF model is warming up, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5s
      return generateResponse(prompt); // retry once
    }

    console.error("❌ Flan-T5 Error:", error.response?.data || error.message);
    return "⚠️ Hugging Face model call failed";
  }
}



async function detectJobSearchIntent(userInput) {
  console.log("🔍 User Input:", userInput);

  // More inclusive job search pattern: captures optional prefixes + job keywords
  const jobSearchPattern = /\b(?:find|search|get|looking for|give me|show me)?\s*([a-zA-Z\s]+?)\s*(?:job|jobs|role|roles|openings?)\b/i;
  const locationPattern = /\b(?:in|at)\s+([a-zA-Z\s]+)\b/i;

  let jobQuery = "";
  let location = "Bangalore"; // Default location

  const jobMatch = userInput.match(jobSearchPattern);
  console.log("🧠 Job Match:", jobMatch);

  if (jobMatch && jobMatch[1]) {
    jobQuery = jobMatch[1].trim();
  }

  const locationMatch = userInput.match(locationPattern);
  console.log("📍 Location Match:", locationMatch);

  if (locationMatch && locationMatch[1]) {
    location = locationMatch[1].trim().split(' ')[0]; // Keep only the first word
  }

  location = location.replace(/\s+/g, " ").trim(); // Clean up whitespace

  const intentResult = jobQuery
    ? { isJobSearch: true, jobQuery, location }
    : { isJobSearch: false };

  console.log("✅ Final Job Intent:", intentResult);
  return intentResult;
}
// Fallback: Use Gemini API when Flan-T5 fails or output is invalid
async function geminiFallback(prompt) {
  // Check if the prompt is within the intended scope
  const careerKeywords = [
    "career", 
    "mentorship", 
    "leadership", 
    "professional", 
    "development", 
    "advancement", 
    "job", 
    "interview", 
    "salary", 
    "promotion", 
    "workplace", 
    "entrepreneur", 
    "skills", 
    "network", 
    "resume", 
    "cv", 
    "glass ceiling", 
    "empowerment", 
    "challenges", 
    "software engineer", 
    "data scientist", 
    "machine learning engineer", 
    "AI researcher", 
    "front-end developer", 
    "back-end developer", 
    "UX/UI designer", 
    "product manager", 
    "project manager", 
    "system architect", 
    "devops engineer", 
    "business analyst", 
    "digital marketer", 
    "content strategist", 
    "full-stack developer", 
    "QA tester", 
    "research scientist", 
    "database administrator", 
    "network administrator", 
    "cloud engineer", 
    "junior", 
    "senior", 
    "lead", 
    "intern", 
    "freelancer", 
    "consultant", 
    "contractor", 
    "remote", 
    "part-time", 
    "full-time", 
    "executive", 
    "entry-level", 
    "mid-level", 
    "senior-level", 
    "executive-level", 
    "transitioning", 
    "career change", 
    "job seeker", 
    "hiring", 
    "fired", 
    "laid-off", 
    "job satisfaction", 
    "work-life balance", 
    "career goals", 
    "job security", 
    "workplace culture", 
    "remote work", 
    "leadership development", 
    "corporate ladder", 
    "salary negotiation", 
    "employee benefits", 
    "career growth", 
    "leadership skills", 
    "technical skills", 
    "soft skills", 
    "communication skills", 
    "problem-solving skills", 
    "collaboration", 
    "time management", 
    "critical thinking", 
    "teamwork", 
    "emotional intelligence", 
    "healthcare professional", 
    "engineering", 
    "finance", 
    "marketing", 
    "education", 
    "nonprofit", 
    "real estate", 
    "entertainment", 
    "e-commerce", 
    "law", 
    "retail", 
    "learning and development", 
    "career advancement", 
    "continuous education", 
    "upskilling", 
    "reskilling", 
    "self-improvement", 
    "certifications", 
    "online courses", 
    "leadership training"
  ];
  const isCareerRelated = careerKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );

  if (!isCareerRelated) {
    return "This question is outside the scope of my expertise.";
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
// Replace with your actual Gemini API key.
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prefix =
  "You are a career and mentorship advisor specifically for women. Please provide guidance and support related to professional development, career advancement, and mentorship. Focus solely on topics relevant to women in the workplace. Respond to the following question: ";
const constrainedPrompt =
  prefix +
  prompt +
  " Keep responses focused on career advice, mentorship, and challenges faced by women in professional settings. Avoid general conversation or topics unrelated to career development. If the question is outside the scope of women's career mentorship, state 'This question is outside the scope of my expertise.' " +
  "You are friendly, approachable, and provide short, concise answers that are easy to read and understand. " +
  "Offer actionable advice and avoid jargon or complex language. Keep your tone empathetic, supportive, and motivational. " +
  "Provide solutions or next steps whenever possible. Maintain a professional and respectful demeanor, with a focus on empowering women in their careers. ";
    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: constrainedPrompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const geminiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini returned empty";

    if (geminiResponse.toLowerCase().includes("outside the scope of my expertise")) {
      return "This question is outside the scope of my expertise.";
    }

    return geminiResponse;
  } catch (error) {
    console.error("❌ Gemini Fallback Error:", error.response?.data || error.message);
    return "⚠️ Gemini fallback failed";
  }
}

// Smart Wrapper: Choose Flan-T5 or Gemini depending on quality
async function smartResponse(userInput) {
  const rawOutput = await generateResponse(userInput);
  const cleaned = cleanOutput(rawOutput);

  const fallbackTriggered =
    isGibberish(cleaned) ||
    isTooShort(cleaned) ||
    cleaned.includes("⚠️") ||
    new Set(cleaned.toLowerCase().split(/\s+/)).size < 7 ||
    cleaned.toLowerCase().includes("python python python") ||
    cleaned.trim() === "" ||
    /^\d+$/.test(cleaned.trim());

  if (fallbackTriggered) {
    const geminiResponse = await geminiFallback(userInput);
    let geminiCleaned = cleanOutput(geminiResponse);

    if (geminiCleaned === "This question is outside the scope of my expertise.") {
      return geminiCleaned;
    }

    const geminiFallbackTriggered =
      isGibberish(geminiCleaned) ||
      isTooShort(geminiCleaned) ||
      geminiCleaned.includes("⚠️") ||
      !hasCommonWords(geminiCleaned) ||
      geminiCleaned.toLowerCase().includes("general knowledge") ||
      geminiCleaned.toLowerCase().includes("random fact") ||
      geminiCleaned.toLowerCase().includes("weather") ||
      geminiCleaned.toLowerCase().includes("gentlemen") ||
      geminiCleaned.toLowerCase().includes("men");

    if (geminiFallbackTriggered) {
      throw new Error("Gemini fallback also failed: Output not meaningful.");
    }

    geminiCleaned = geminiCleaned.replace(/^🌐?\s*Gemini says:\s*/i, "").trim();
    return {
      source: "Gemini (Fallback)",
      response: `🧠 Response:\n${geminiCleaned}`,
    };
  }

  return {
    source: "Flan-T5",
    response: `🧠 Response:\n${cleaned}`,
  };
}
module.exports = {
  smartResponse,
  geminiFallback,
detectJobSearchIntent,
};

