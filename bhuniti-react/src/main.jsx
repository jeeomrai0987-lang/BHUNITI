import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n";
import "./index.css";
import "leaflet/dist/leaflet.css";

// LanguageProvider sits outside the router: the chosen language has to survive
// navigation, and services/api.js reads it to send ?lang= on every request.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
