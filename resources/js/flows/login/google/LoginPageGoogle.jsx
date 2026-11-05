import { loginWithGoogle } from "@/flows/login/google/google.login";

import "./LoginPageGoogle.css";

export default function LoginPageGoogle() {
    const language = navigator.language.toLowerCase();

    const isThai = language.startsWith("th");
    const isGerman = language.startsWith("de");

    const content = isThai
        ? {
              appName: "ระบบขายสินค้าออนไลน์",
              title: "ยินดีต้อนรับสู่",
              description:
                  "หากคุณล็อกอิน Google อยู่แล้ว\nกดปุ่มด้านล่างเพื่อเข้าสู่ระบบ",
              button: "เข้าสู่ระบบด้วย Google",
          }
        : isGerman
          ? {
                appName: "Ecommerce App",
                title: "Willkommen bei",
                description:
                    "Wenn Sie bereits bei Google angemeldet sind,\nklicken Sie unten zum Fortfahren",
                button: "Mit Google fortfahren",
            }
          : {
                appName: "Ecommerce App",
                title: "Welcome to",
                description:
                    "If you are already signed in with Google,\npress the button below to continue.",
                button: "Continue with Google",
            };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">
                    <span className="login-title-small">{content.title}</span>

                    <span className="login-title-main">{content.appName}</span>
                </h1>

                <p className="login-description">{content.description}</p>

                <button className="login-google-btn" onClick={loginWithGoogle}>
                    {content.button}
                </button>
            </div>
        </div>
    );
}
