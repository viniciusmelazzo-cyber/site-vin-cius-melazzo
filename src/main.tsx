import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Patch to prevent "removeChild" errors caused by browser extensions
// that manipulate the DOM outside of React's control
const container = document.getElementById("root")!;

if (container) {
  const originalRemoveChild = container.removeChild.bind(container);
  container.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== container) {
      console.warn("Prevented removeChild error from browser extension DOM manipulation");
      return child;
    }
    return originalRemoveChild(child);
  };
}

createRoot(container).render(<App />);
