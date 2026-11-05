import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css"; //come with install react vite
import "./styles/App.css";
import "./styles/theme.css";
import "./styles/z-index.css";
import App from "./App.jsx";
import { DevProvider } from "@/components/DevProvider.jsx";

// import { setLogLevel } from "firebase/firestore";
// setLogLevel("debug");

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <DevProvider>
            <App />
        </DevProvider>
    </StrictMode>,
);
