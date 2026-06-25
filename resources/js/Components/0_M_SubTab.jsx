// resources/js/Components/0_M_SubTab.jsx
import React, { useState } from "react";
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
    if (!data) return <div>ไม่มีข้อมูล</div>;

    const subTabs = Object.keys(data).filter(
        (M_Class_Name) => typeof data[M_Class_Name] === "object",
    );
    const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

    const [focus_Siderbar_Button, set_Focus_Siderbar_Button] = useState(null);

    const fieldNames = Object.keys(data[activeSubTab] || {});

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
                <div className="column-flex">
                    <TabContent
                        M_Class_Name={activeSubTab}
                        M_value={data[activeSubTab]}
                        onUpdate={onUpdate}
                        focus_Siderbar_Button={focus_Siderbar_Button}
                        set_Focus_Siderbar_Button={set_Focus_Siderbar_Button}
                    />
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <h3 className="json-header">JSON Data</h3>
                    <pre className="json-pre">
                        {JSON.stringify(data[activeSubTab], null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
