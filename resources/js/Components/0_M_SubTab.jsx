// resources/js/Components/0_M_SubTab.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";

import TabContent from "@/Components/0_M_TabContent";
import JSON_Content from "@/Components/0_M_JSON_Content";

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
    // console.count("[DEBUG] SubTab Rendered");
    if (!data) return;

    /**
     * ONLY 1 state to focus 3 Components with same click
     */
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    /**
     * SET SubTab
     */
    const activeSubTab = use_M_Store((state) => state.activeSubTab);
    const setActiveSubTab = use_M_Store((state) => state.setActiveSubTab);

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    const default_SubTab = Object.keys(data).filter(
        (M_Class_Name) => typeof data[M_Class_Name] === "object",
    );

    /**
     * get M_value from SubTab
     */
    const M_value = useMemo(() => {
        return data[activeSubTab] || {};
    }, [data, activeSubTab]);

    useEffect(() => {
        // เพิ่มการเช็คว่า M_value มีข้อมูลจริงก่อนสั่ง set
        if (!M_value || Object.keys(M_value).length === 0) return;

        use_M_Store.getState().set_M_value(M_value);
    }, [activeSubTab]);

    const fieldnames = Object.keys(M_value || {});

    /**
     * SET default Subtab
     */
    useEffect(() => {
        // get all SubTab from data
        const currentSubTabs = Object.keys(data).filter(
            (key) => typeof data[key] === "object",
        );

        // choose one SubTab if no chosen
        if (!activeSubTab || !currentSubTabs.includes(activeSubTab)) {
            const default_SubTab = getDefaultSubTab(currentSubTabs);
            setActiveSubTab(default_SubTab);
        }
    }, [data, activeSubTab]);

    function getDefaultSubTab(default_SubTab) {
        if (default_SubTab.includes("ENTITIES")) {
            return "ENTITIES";
        }

        if (default_SubTab.includes("app_data")) {
            return "f";
        }

        // A Tab must have at least 1 SubTab
        return default_SubTab[0];
    }

    return (
        <>
            {" "}
            {/* Tab         SubTab */}
            {/* M-DATA      S CD D U CU CUD */}
            {/* APP-DATA    F T */}
            {/* ENTITIES    ENTITIES*/}
            <div className="subtab-container">
                {default_SubTab.map((M_Class_Name) => (
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
                                // fieldname = null , when field deleted
                                if (fieldname) setActiveField(fieldname);
                            }}
                        >
                            {/* if Class t (DB_Tablename) remove T:: */}
                            {fieldname.toUpperCase().replaceAll("T::", "")}
                        </button>
                    ))}
                </nav>

                {/* left column = Input Boxes */}
                <div className="column-flex-form">
                    <TabContent M_Class_Name={activeSubTab} />
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <JSON_Content />
                </div>
            </div>
        </>
    );
}
