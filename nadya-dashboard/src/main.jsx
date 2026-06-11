import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { migrate } from "./lib/migrations.js";
import "./index.css";

// Upgrade/seed localStorage before anything reads it.
migrate();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
