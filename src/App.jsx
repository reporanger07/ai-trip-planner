import { Routes, Route } from "react-router-dom"; // Import only Routes and Route
import Hero from "./components/ui/custom/Hero";
import CreateTrip from "./create-trip/index.jsx"; // Import the CreateTrip page

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />{" "}
        {/* Home page with Hero component */}
        <Route path="/create-trip" element={<CreateTrip />} />{" "}
        {/* CreateTrip page */}
      </Routes>
    </div>
  );
}

export default App;
