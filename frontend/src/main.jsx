import React from "react";
import ReactDOM from "react-dom/client";
import NyayTak from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NyayTak />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registered!", reg))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
