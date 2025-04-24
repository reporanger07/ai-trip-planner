// AIModel.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load your Gemini API key from .env
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_GEMINI_AI_API_KEY is not set in .env");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // You can also use "gemini-pro"
});

/**
 * Function to send a message to Gemini and get a response
 * @param {string} userInput - The prompt/question you want to ask Gemini
 * @returns {Promise<string>} - AI's response as plain text
 */
export const getAIResponse = async (userInput) => {
  try {
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 64,
        maxOutputTokens: 2048,
      },
      history: [], // Add history here if needed
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, something went wrong while talking to Gemini.";
  }
};
