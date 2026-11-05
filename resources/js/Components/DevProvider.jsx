import { createContext, useContext, useState, useEffect } from "react";
import "./DevProvider.css";

const DevContext = createContext();

const isLocalhost = window.location.hostname === "localhost";

const getInitialDev = () => {
    const saved = localStorage.getItem("DEV_MODE");

    // priority:
    // 1. manual override (localStorage)
    if (saved !== null) return saved === "true";

    // 2. auto dev on localhost
    return isLocalhost;
};

export function DevProvider({ children }) {
    const [DEV_MODE, setDEV_MODE] = useState(getInitialDev);

    // sync localStorage
    useEffect(() => {
        localStorage.setItem("DEV_MODE", DEV_MODE);
    }, [DEV_MODE]);

    const toggle = () => {
        setDEV_MODE((v) => !v);
    };

    const setDEV_MODE_SAFE = (value) => {
        setDEV_MODE(!!value);
    };

    return (
        <DevContext.Provider
            value={{
                DEV: DEV_MODE, // 🔥 ใช้ชื่อ DEV ได้เลยในทั้งโปรเจกต์
                DEV_MODE, // (optional เผื่อบางที่ยังใช้)
                toggle,
                setDEV: setDEV_MODE_SAFE,
            }}
        >
            {/* UI toggle (ไม่เปลี่ยน CSS ของคุณ) */}
            <div
                className="dev-switch"
                onClick={toggle}
                style={{
                    display: isLocalhost || DEV_MODE ? "block" : "none",
                }}
            >
                <div className={`track ${DEV_MODE ? "on" : "off"}`}>
                    <div className="thumb" />
                </div>
            </div>

            {children}
        </DevContext.Provider>
    );
}

export function useDev() {
    return useContext(DevContext);
}
