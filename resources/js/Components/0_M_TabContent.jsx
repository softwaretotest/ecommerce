import { React, useState, useRef, useEffect } from "react";
import SpecialField from "@/Components/0_M_SpecialField.jsx";
import Field from "@/Components/0_M_Field.jsx";

export default function TabContent({
    M_Class_Name,
    M_value,
    onUpdate,
    focus_Siderbar_Button,
    set_Focus_Siderbar_Button,
}) {
    if (!M_value || typeof M_value !== "object") {
        return (
            <div className="ui-placeholder">ไม่มี UI สำหรับ {M_Class_Name}</div>
        );
    }

    const handleChange = (key, newValue) => {
        onUpdate({ ...M_value, [key]: newValue });
    };

    const [focusField, setFocusField] = useState(null);

    const scrollRefs = useRef({});

    useEffect(() => {
        if (
            focus_Siderbar_Button &&
            scrollRefs.current[focus_Siderbar_Button]
        ) {
            scrollRefs.current[focus_Siderbar_Button].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [focus_Siderbar_Button]);

    useEffect(() => {
        const handleFocus = (e) => {
            const fieldName = e.detail;
            setFocusField(fieldName);

            // auto Scroll to Ref of that field
            if (scrollRefs.current[fieldName]) {
                scrollRefs.current[fieldName].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        };

        window.addEventListener("focus-field", handleFocus);
        return () => window.removeEventListener("focus-field", handleFocus);
    }, []);

    return (
        <>
            <div>
                <label>M_Class_Name = {M_Class_Name}</label>
            </div>
            <div className="input-engine-container">
                {/* LOOP OF FIELDS e.g. M_Class_Name = f , t , s , d , u , cd , cu , cud */}
                {Object.entries(M_value).map(([key, val]) => (
                    <div
                        key={key}
                        ref={(el) => (scrollRefs.current[key] = el)}
                        className={`field-row-wrapper-custom ${focusField === key ? "is-focused" : ""}`}
                        onClick={() => {
                            setFocusField(key);
                            set_Focus_Siderbar_Button(key);
                        }}
                    >
                        {/* left column: Capital Letter (Key) */}
                        {M_Class_Name !== "f" && M_Class_Name !== "s" && (
                            <>
                                <input
                                    className="field-key-input"
                                    defaultValue={
                                        M_Class_Name === "t"
                                            ? key
                                            : key.toUpperCase()
                                    }
                                    onBlur={(e) =>
                                        handleKeyChange(key, e.target.value)
                                    }
                                />
                                <span className="field-separator-colon">:</span>
                            </>
                        )}

                        {/* คอลัมน์ขวา: Input หรือ Field Component */}
                        <div className="field-input-wrapper">
                            {M_Class_Name === "s" && Array.isArray(val) && (
                                <SpecialField field_data={val} />
                            )}

                            {M_Class_Name === "f" && Array.isArray(val) && (
                                <Field field_data={val} />
                            )}

                            {M_Class_Name !== "s" && M_Class_Name !== "f" && (
                                <input
                                    type="text"
                                    className="M_field-value-input"
                                    defaultValue={val}
                                    onBlur={(e) =>
                                        handleChange(key, e.target.value)
                                    }
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
