// resources/js/Components/0_M_SubTab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";
import JSON_Content from "./0_M_JSON_Content";

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
export default function SubTab({ data }) {
    // const setFocus = use_M_Store((state) => state.setFocus);

    /**
     * ONLY 1 state to focus 3 Components with same click
     */
    const [activeField, setActiveField] = useState(null);
    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    const subTabs = Object.keys(data).filter(
        (M_Class_Name) => typeof data[M_Class_Name] === "object",
    );

    const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

    const M_value = data[activeSubTab];

    const fieldnames = Object.keys(M_value || {});

    /**
     * OLD solution works, will be removed
     */
    const D_States = use_M_Store.getState().D_States;
    const CD_States = use_M_Store.getState().CD_States;
    const set_CD_States = use_M_Store.getState().set_CD_States;
    const set_States = use_M_Store((state) => state.set_States);

    function update_All_States(fieldname, M_value) {
        const [D_States, CD_States] = set_Focus_D_CD_States(fieldname, M_value);

        set_States(fieldname, CD_States, D_States);
    }

    useEffect(() => {
        console.log(
            "0_M_SubTab.jsx -OLD_SOLUTION- D_States อัปเดตแล้ว:",
            D_States,
        );
        console.log(
            "0_M_SubTab.jsx -OLD_SOLUTION- CD_States อัปเดตแล้ว:",
            CD_States,
        );
    }, [CD_States]);

    return (
        <>
            {" "}
            {/* M-DATA   S CD D U CU CUD */}
            {/* APP-DATA F T */}
            {/* ENTITIES */}
            <div className="subtab-container">
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
            {/* SIDEBAR , TabConten , JSON_Content */}
            <div className="content-box content-grid">
                {/* SIDEBAR */}
                <nav className="field-sidebar">
                    {fieldnames.map((fieldname) => (
                        <button
                            key={fieldname}
                            ref={(DOM_Node) =>
                                (scrollRefs.current[fieldname] = DOM_Node)
                            }
                            className={`field-nav-link ${activeField === fieldname ? "active" : ""}`}
                            onClick={() => {
                                setActiveField(fieldname);
                                // setFocus(fieldname, M_value);
                                update_All_States(fieldname, M_value);
                            }}
                        >
                            {/* if Class t (DB_Tablename) remove T:: */}
                            {fieldname.toUpperCase().replaceAll("T::", "")}
                        </button>
                    ))}
                </nav>

                {/* left column = Input Boxes */}
                <div className="column-flex-form">
                    <TabContent
                        M_Class_Name={activeSubTab}
                        M_value={M_value}
                        activeField={activeField}
                        setActiveField={setActiveField}
                    />
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <h3 className="json-header">JSON Data</h3>
                    <JSON_Content
                        M_value={M_value}
                        activeField={activeField}
                        setActiveField={setActiveField}
                    />
                </div>
            </div>
        </>
    );
}
