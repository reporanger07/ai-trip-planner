import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import CreateTrip from "./create-trip/index.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "sonner"; // ✅ Correctly imported Toaster for global toast messages

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "create-trip",
    element: <CreateTrip />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster /> {/* ✅ Ensure this is the only instance of Toaster */}
  </React.StrictMode>
);
