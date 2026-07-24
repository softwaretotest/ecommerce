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
export default function SubTab({ data, activeTab_param }) {
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
     * first M_value on refresh
     */
    const M_value = useMemo(() => {
        return data[activeSubTab] || {};
    }, [data, activeSubTab]);

    /**
     * * subTab set_M_value , when user klick to change SubTab
     */
    useEffect(() => {
        // เพิ่มการเช็คว่า M_value มีข้อมูลจริงก่อนสั่ง set
        if (!M_value || Object.keys(M_value).length === 0) return;

        use_M_Store.getState().set_M_value(M_value);
        // console.log(
        //     "!!!!!!!!!!!!  SubTab -- useEffect -- activeSubTab = ",
        //     activeSubTab,
        // );
        // console.log(
        //     "!!!!!!!!!!!!  SubTab -- useEffect -- use_M_Store.getState().activeTab = ",
        //     use_M_Store.getState().activeTab,
        // );
        // console.log(
        //     "!!!!!!!!!!!!  SubTab -- useEffect -- activeTab_param = ",
        //     activeTab_param,
        // );
    }, [activeSubTab, activeTab_param]);

    const fieldnames = Object.keys(M_value || {});

    /**
     * SET default Subtab (DEBUG VERSION - WITH LINE NUMBERS)
     */
    // useEffect(() => {
    //     console.log("==========================================");
    //     console.log("[82] [DEBUG useEffect] Triggered!");
    //     console.log("[83] [DEBUG useEffect] raw data passed in:", data);
    //     console.log(
    //         "[84] [DEBUG useEffect] current activeSubTab from store:",
    //         activeSubTab,
    //     );

    //     // get all SubTab from data
    //     const currentSubTabs = Object.keys(data).filter(
    //         (key) => typeof data[key] === "object",
    //     );

    //     console.log(
    //         "[95] [DEBUG useEffect] -> Keys inside data:",
    //         Object.keys(data),
    //     );
    //     console.log(
    //         "[99] [DEBUG useEffect] -> Filtered currentSubTabs result:",
    //         currentSubTabs,
    //     );
    //     console.log(
    //         "[103] [DEBUG useEffect] -> Does currentSubTabs include activeSubTab ('" +
    //             activeSubTab +
    //             "')?:",
    //         currentSubTabs.includes(activeSubTab),
    //     );

    //     const isMissing = !activeSubTab;
    //     const isNotInList = !currentSubTabs.includes(activeSubTab);

    //     // choose one SubTab if no chosen
    //     if (isMissing || isNotInList) {
    //         const Default_SubTab = get_Default_SubTab(currentSubTabs);
    //         console.log(
    //             "[116] [DEBUG useEffect] Condition MET! Setting default SubTab to:",
    //             Default_SubTab,
    //         );
    //         setActiveSubTab(Default_SubTab);
    //     } else {
    //         console.log(
    //             "[121] [DEBUG useEffect] Condition NOT met. activeSubTab is valid, doing nothing.",
    //         );
    //     }
    //     console.log("==========================================");
    // }, [data]); //lately activeSubTab was removed from dependency, to avoid re-dender this useEffect
    const activeTab = use_M_Store.getState().activeTab;

    const [can_render_TabContent, set_can_render_TabContent] = useState(false);
    useEffect(() => {
        console.log("==========================================");
        console.log("[82] [DEBUG useEffect] Triggered!");
        console.log("[83] [DEBUG useEffect] raw data passed in :", data);
        console.log("[84] [DEBUG useEffect] activeTab :", activeTab);
        console.log(
            "[85] [DEBUG useEffect] current activeSubTab from store:",
            activeSubTab,
        );

        if (!activeTab) return; //this was set in M_Store on refresh

        const Default_SubTab = get_Default_SubTab(activeTab);

        // choose one SubTab if no chosen
        if (!activeSubTab) {
            console.log(
                "[116] [DEBUG useEffect] Condition MET! Setting default SubTab to:",
                Default_SubTab,
            );
            setActiveSubTab(Default_SubTab);
            set_can_render_TabContent(false);
            return;
        }

        const all_subTab_in_data = Object.keys(data).filter(
            (key) => typeof data[key] === "object" && data[key] !== null,
        );
        console.log("[117] [DEBUG useEffect] data : ", data);
        console.log(
            "[118] [DEBUG useEffect] all_subTab_in_data : ",
            all_subTab_in_data,
        );

        if (activeSubTab && !all_subTab_in_data.includes(activeSubTab)) {
            setActiveSubTab(Default_SubTab);
            set_can_render_TabContent(false);
            return;
        }

        set_can_render_TabContent(true);
        // if activeTab and activeSubTab correct)
        // [84] [DEBUG useEffect] activeTab : m_data
        // [85] [DEBUG useEffect] current activeSubTab from store: d
    }, [data, activeSubTab]);

    function get_Default_SubTab() {
        // const activeTab = use_M_Store.getState().activeTab;
        if (activeTab === "entities") {
            console.log("[134] [DEBUG get_Default_SubTab] matched entities");
            return "entities";
        }

        if (activeTab === "app_data") {
            console.log(
                "[139] [DEBUG get_Default_SubTab] matched app_data -> returning 'f'",
            );
            return "f";
        }

        if (activeTab === "m_data") {
            console.log(
                "[140] [DEBUG get_Default_SubTab] matched app_data -> returning 'f'",
            );
            return "d";
        }

        // A Tab must have at least 1 SubTab
        // console.log(
        //     "[161] [DEBUG get_Default_SubTab] fallback to first index:",
        //     default_SubTab_list[0],
        // );
        // return default_SubTab_list[0];
    }

    // /**
    //  * SET default Subtab
    //  */
    // useEffect(() => {
    //     // get all SubTab from data
    //     const currentSubTabs = Object.keys(data).filter(
    //         (key) => typeof data[key] === "object",
    //     );

    //     // choose one SubTab if no chosen
    //     if (!activeSubTab || !currentSubTabs.includes(activeSubTab)) {
    //         const default_SubTab = get_Default_SubTab(currentSubTabs);
    //         setActiveSubTab(default_SubTab);
    //     }
    // }, [data, activeSubTab]);

    // function get_Default_SubTab(default_SubTab) {
    //     if (default_SubTab.includes("ENTITIES")) {
    //         return "ENTITIES";
    //     }

    //     if (default_SubTab.includes("app_data")) {
    //         return "f";
    //     }

    //     // A Tab must have at least 1 SubTab
    //     return default_SubTab[0];
    // }

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
                    {can_render_TabContent && (
                        <TabContent
                            M_Class_Name={activeSubTab}
                            activeTab_param={activeTab_param}
                        />
                    )}
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <JSON_Content />
                </div>
            </div>
        </>
    );
}
