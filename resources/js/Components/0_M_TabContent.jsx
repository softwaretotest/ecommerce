// 0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";

export default function TabContent({
    M_Class_Name,
    M_value,
    onUpdate,
    focus_Siderbar_Button,
    set_Focus_Siderbar_Button,
    focusField,
    setFocusField,
}) {
    if (!M_value || typeof M_value !== "object") {
        return (
            <div className="ui-placeholder">ไม่มี UI สำหรับ {M_Class_Name}</div>
        );
    }

    const handleChange = (fieldname, newValue) => {
        onUpdate({ ...M_value, [fieldname]: newValue });
    };

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

    const D_States = use_M_Store.getState().D_States;
    const CD_States = use_M_Store.getState().CD_States;
    const set_CD_States = use_M_Store.getState().set_CD_States;
    const set_States = use_M_Store((state) => state.set_States);

    function update_All_States(fieldname, M_value) {
        const [D_States, CD_States] = set_Focus_D_CD_States(fieldname, M_value);

        set_States(fieldname, CD_States, D_States);
    }

    // useEffect(() => {
    //     console.log("0_M_TabContent.jsx - D_States อัปเดตแล้ว:", D_States);
    //     console.log("0_M_TabContent.jsx - CD_States อัปเดตแล้ว:", CD_States);
    // }, [CD_States]);

    return (
        <>
            <div>
                <label>M_Class_Name = {M_Class_Name}</label>
            </div>
            <div className="input-engine-container">
                {/* LOOP OF FIELDS e.g. M_Class_Name = f , t , s , d , u , cd , cu , cud */}
                {Object.entries(M_value).map(([fieldname, val]) => (
                    <div
                        key={fieldname}
                        ref={(el) => (scrollRefs.current[fieldname] = el)}
                        className={`form-subtab-content-row ${focusField === fieldname ? "is-focused" : ""}`}
                        onClick={() => {
                            setFocusField(fieldname);
                            set_Focus_Siderbar_Button(fieldname);

                            update_All_States(fieldname, M_value);
                        }}
                    >
                        {/* left column: Capital Letter (Fieldname) */}
                        {M_Class_Name !== "f" && M_Class_Name !== "s" && (
                            <>
                                <input
                                    className="field-key-input"
                                    defaultValue={
                                        M_Class_Name === "t"
                                            ? fieldname
                                            : fieldname.toUpperCase()
                                    }
                                    onBlur={(e) =>
                                        handleKeyChange(
                                            fieldname,
                                            e.target.value,
                                        )
                                    }
                                />
                                <span className="field-separator-colon">:</span>
                            </>
                        )}

                        {/* middle column: Input Fields */}
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
                                    handleChange(fieldname, e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
