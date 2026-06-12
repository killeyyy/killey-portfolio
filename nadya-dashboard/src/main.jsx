import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { migrate } from "./lib/migrations.js";
import "./index.css";

// Upgrade/seed localStorage before anything reads it.
migrate();

// When a new deploy's service worker takes control, swap to it in place —
// otherwise the PWA keeps showing the previous build until a manual refresh.
if ("serviceWorker" in navigator) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
