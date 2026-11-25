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

/**
 * ```text
 * StrictMode help DEV to test
 * React uses <StrictMode> in development to surface side-effect bugs early
 * rather than letting them hide until production:
 * x
 * 1. Test idempotency: Re-running renders and useEffect (with cleanup) in dev
 * helps catch unguarded duplicate requests, missing cleanup functions,
 * or leaked listeners/timers.
 * x
 * 2. Simulate future lifecycle behavior: It mimics remounting
 * or preserving/restoring UI states (such as concurrent rendering, Offscreen, or Activity),
 * exposing code that wrongly assumes a component only mounts once.
 *
 * IMPORTANT !!! NOTE:
 * I REMOVED StrictMode because of console.log pollution
 * at the end of Project before switch to PROD
 * we must switch on StrictMode and test UI completely again
 */
createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <DevProvider>
        <App />
    </DevProvider>,
    // </StrictMode>,
);
