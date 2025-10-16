import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import PomodoroApp from "./PomodoroApp.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PomodoroApp />
  </StrictMode>,
);
