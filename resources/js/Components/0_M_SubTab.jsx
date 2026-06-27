// resources/js/Components/0_M_SubTab.jsx
import React, { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

import TabContent from "@/Components/0_M_TabContent";
import "../../css/0_M_UI.css";

/**
 * @param {*} data
 * if SubTab = APP DATA , then data = content of 1_App-Data.json
 * ,e.g. * f:: = Field
 *
 * if SubTab = M DATA , then data = content of 1_M-Data.json
 * ,e.g. * Tabs of Classes S CD D U CU CUD
 *
 * if SubTab = ENTITIES , then data = content of 1_Entities.json
 * ,e.g. * t:: = Tablename
 */
export default function SubTab({ data, onUpdate }) {
    const subTabs = Object.keys(data).filter(
        (M_Class_Name) => typeof data[M_Class_Name] === "object",
    );

    const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

    const M_value = data[activeSubTab];

    const [focus_Siderbar_Button, set_Focus_Siderbar_Button] = useState(null);

    const [focusField, setFocusField] = useState(null);

    const fieldnames = Object.keys(M_value || {});

    const D_States = use_M_Store.getState().D_States;
    const CD_States = use_M_Store.getState().CD_States;
    const set_CD_States = use_M_Store.getState().set_CD_States;
    const set_States = use_M_Store((state) => state.set_States);

    function update_All_States(fieldname, M_value) {
        const [D_States, CD_States] = set_Focus_D_CD_States(fieldname, M_value);

        set_States(fieldname, CD_States, D_States);
    }

    // useEffect(() => {
    //     console.log("0_M_SubTab.jsx - D_States อัปเดตแล้ว:", D_States);
    //     console.log("0_M_SubTab.jsx - CD_States อัปเดตแล้ว:", CD_States);
    // }, [CD_States]);

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
                    {fieldnames.map((fieldname) => (
                        <button
                            key={fieldname}
                            className={`field-nav-link ${focus_Siderbar_Button === fieldname ? "active" : ""}`}
                            onClick={() => {
                                set_Focus_Siderbar_Button(fieldname);
                                setFocusField(fieldname);

                                update_All_States(fieldname, M_value);

                                window.dispatchEvent(
                                    new CustomEvent("focus-field", {
                                        detail: fieldname,
                                    }),
                                );
                            }}
                        >
                            {fieldname.toUpperCase()}
                        </button>
                    ))}
                </nav>

                {/* left column = Input Boxes */}
                <div className="column-flex-form">
                    <TabContent
                        M_Class_Name={activeSubTab}
                        M_value={M_value}
                        onUpdate={onUpdate}
                        // params for 2-way states binding
                        focus_Siderbar_Button={focus_Siderbar_Button}
                        set_Focus_Siderbar_Button={set_Focus_Siderbar_Button}
                        focusField={focusField}
                        setFocusField={setFocusField}
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
