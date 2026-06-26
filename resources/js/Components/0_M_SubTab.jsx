// resources/js/Components/0_M_SubTab.jsx
import React, { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";

import TabContent from "@/Components/0_M_TabContent.jsx";
import "../../css/0_M_UI.css";

/**
 *  Tabs of Classes S CD D U CU CUD
 * @param {*} data  = content of the Classes
 Class D 
 {
  "BOOLEAN": "boolean",
  ....
 }
 */
export default function SubTab({ data, onUpdate }) {
    
    const set_M_Focus = use_M_Store((state) => state.set_M_Focus);
    // const M_Focus = use_M_Store((state) => state.M_Focus);

    const set_M_Store = (key, val) => {
        const currentInitialRules = Array.isArray(val) ? val : [];

        set_M_Focus(key, currentInitialRules);

        // console.log(
        //     `[Verify] ตอนนี้โฟกัสฟิลด์: "${key}" | ข้อมูลคือ:`,
        //     currentInitialRules,
        // );
    };

    // useEffect(() => {
    //     console.log("[Store Updated] ข้อมูลฟิลด์ที่โฟกัสอยู่ขณะนี้:", M_Focus);
    // }, [M_Focus]);

    const subTabs = Object.keys(data).filter(
        (M_Class_Name) => typeof data[M_Class_Name] === "object",
    );
    const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

    const M_value = data[activeSubTab];

    const [focus_Siderbar_Button, set_Focus_Siderbar_Button] = useState(null);

    const fieldNames = Object.keys(M_value || {});

    return (
        <div className="subtab-wrapper">
            {/* M-DATA   S CD D U CU CUD */}
            {/* APP-DATA F T */}
            {/* ENTITIES */}
            <div className="subtabs-container">
                {subTabs.map((M_Class_Name) => (
                    <button
                        key={M_Class_Name}
                        className={`subtab-button ${activeSubTab === M_Class_Name ? "active" : ""}`}
                        onClick={() => {
                            setActiveSubTab(M_Class_Name);
                        }}
                    >
                        {M_Class_Name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* show 2 column */}
            <div className="content-box content-grid">
                <nav className="field-sidebar">
                    {fieldNames.map((fieldName) => (
                        <button
                            key={fieldName}
                            className={`field-nav-link ${focus_Siderbar_Button === fieldName ? "active" : ""}`}
                            onClick={() => {
                                set_M_Store(fieldName, M_value[fieldName]);
                                set_Focus_Siderbar_Button(fieldName);
                                window.dispatchEvent(
                                    new CustomEvent("focus-field", {
                                        detail: fieldName,
                                    }),
                                );
                            }}
                        >
                            {fieldName.toUpperCase()}
                        </button>
                    ))}
                </nav>

                {/* left column = Input Boxes */}
                <div className="column-flex-form">
                    <TabContent
                        M_Class_Name={activeSubTab}
                        M_value={M_value}
                        onUpdate={onUpdate}
                        focus_Siderbar_Button={focus_Siderbar_Button}
                        set_Focus_Siderbar_Button={set_Focus_Siderbar_Button}
                    />
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <h3 className="json-header">JSON Data</h3>
                    <pre className="json-pre">
                        {JSON.stringify(M_value, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
