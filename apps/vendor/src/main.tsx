import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mercurjs/vendor/index.css";
import App from "@mercurjs/vendor";
import { bootstrapNativeShell } from "./native-shell";

void bootstrapNativeShell();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
