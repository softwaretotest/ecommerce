import React from "react";
import SpecialField from "@/Components/0_M_SpecialField.jsx";
import Field from "@/Components/0_M_Field.jsx";

export default function TabContent({ M_Class_Name, M_value, onUpdate }) {
    if (!M_value || typeof M_value !== "object") {
        return (
            <div className="ui-placeholder">ไม่มี UI สำหรับ {M_Class_Name}</div>
        );
    }

    const handleChange = (key, newValue) => {
        onUpdate({ ...M_value, [key]: newValue });
    };

    return (
        <div className="input-engine-container">
            <div>
                <label>M_Class_Name = {M_Class_Name}</label>
            </div>
            {Object.entries(M_value).map(([key, val]) => (
                <div key={key} className="field-row-wrapper-custom">
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
    );
}
