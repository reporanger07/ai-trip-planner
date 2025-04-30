import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { ChatSession } from "@google/generative-ai";
import { getAIResponse } from "../service/AIModel";

function CreateTrip() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [tripResponse, setTripResponse] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    if (
      !formData?.location ||
      !formData?.budget ||
      !formData?.noOfdays ||
      !formData?.traveller
    ) {
      toast("Please fill all details");
      return;
    }

    // Generate the final prompt by replacing placeholders in AI_PROMPT
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replace("{totalDays}", formData.noOfdays)
      .replace("{traveler}", formData.traveller)
      .replace("{budget}", formData.budget);

    console.log("Generated Prompt:", FINAL_PROMPT);

    try {
      // Get response from AI (OpenRouter Gemini)
      const aiResponse = await getAIResponse(FINAL_PROMPT);
      console.log("AI Response:", aiResponse);

      // Check if the AI response is valid
      if (aiResponse) {
        setTripResponse({ details: aiResponse });
      } else {
        console.error("AI Response is undefined or invalid");
        toast("Failed to generate a valid trip response.");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip, please try again later.");
    }
  };

  const locationInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${
          import.meta.env.VITE_LOCATIONIQ_API_KEY
        }&q=${value}&limit=5`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.display_name);
    setSuggestions([]);
    handleInputChange("location", suggestion.display_name);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <Toaster richColors position="top-center" />

      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      {/* Location Input */}
      <div className="mt-20">
        <h2 className="text-xl my-3 font-medium">
          What is your destination of choice?
        </h2>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={locationInputChange}
            placeholder="Enter a destination..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            aria-label="Destination Input"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Number of days input */}
      <div className="mt-8">
        <h2 className="text-xl my-3 font-medium">
          How many days will your trip be?
        </h2>
        <input
          type="number"
          value={formData.noOfdays || ""}
          onChange={(e) => handleInputChange("noOfdays", e.target.value)}
          min="1"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="e.g., 5"
          aria-label="Number of Days Input"
        />
      </div>

      {/* Budget Selection */}
      <div className="mt-8">
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-10 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                formData.budget === item.title ? "border-black shadow-lg" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Companions Selection */}
      <div className="mt-8">
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-10 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveller", item.people)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                formData.traveller === item.people
                  ? "border-black shadow-lg"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className="p-5">
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
      </div>

      {/* Display Trip Response */}
      {tripResponse && (
        <div className="mt-10">
          <h2 className="font-bold text-2xl">Your Custom Trip Plan</h2>
          <pre className="text-gray-700">{JSON.stringify(tripResponse.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
