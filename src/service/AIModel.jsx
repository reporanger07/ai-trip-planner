const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("VITE_OPENROUTER_API_KEY is not set in .env");
}

const openRouterAPIEndpoint = "https://openrouter.ai/api/v1/chat/completions";

/*
 * Sends a prompt (with optional image) to OpenRouter's Gemini model and returns the AI response.
 * @param {string} userInput - The user's text input.
 * @param {string|null} imageUrl - Optional image URL to include in the message.
 * @returns {Promise<string>} - The AI-generated response.
 */
export const getAIResponse = async (userInput, imageUrl = null) => {
  try {
    // Build content array dynamically
    const content = [
      {
        type: "text",
        text: userInput,
      }
    ];

    // If imageUrl is provided, add it
    if (imageUrl) {
      content.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await fetch(openRouterAPIEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", // Change in production
        "X-Title": "Trip Planner AI", // Optional
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: content,
          }
        ],
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      console.error("OpenRouter returned unexpected response:", data);
      return "Sorry, the AI did not return a valid response.";
    }
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    return "Sorry, something went wrong while contacting OpenRouter.";
  }
};
