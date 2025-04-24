import React, { useState } from "react";
import { getAIResponse } from "../service/AIModel";

const TravelPlanner = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    const result = await getAIResponse(prompt);
    setResponse(result);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Travel Planner (Gemini)</h1>
      <textarea
        className="w-full border p-2 mb-2"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Gemini to plan your trip..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAsk}
      >
        Ask Gemini
      </button>
      {response && (
        <pre className="mt-4 bg-gray-100 p-3 whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  );
};

export default TravelPlanner;
