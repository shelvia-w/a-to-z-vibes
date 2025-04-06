import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Winky+Sans:ital,wght@0,300..900;1,300..900&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
