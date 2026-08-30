import React from "react";
import ReactDOM from "react-dom/client";
import NyayTak from "./App.jsx";
import "./styles.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NyayTak />
    <SpeedInsights />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("Service Worker registered!", reg))
    .catch((err) => console.log("Service Worker registration failed:", err));
}
