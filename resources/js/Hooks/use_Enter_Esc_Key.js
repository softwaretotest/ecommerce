// resources/js/Hooks/use_Enter_Esc_Key.jsx
import { useEffect } from "react";

export function use_Enter_Esc_Key(active, onSave, onCancel) {
    useEffect(() => {
        if (!active) return; // ทำงานเฉพาะเมื่อ Input นี้ถูก Active อยู่

        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                onSave();
            }
            if (e.key === "Escape") {
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [active, onSave, onCancel]);
}
