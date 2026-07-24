// resources/js/Components/0_M_SubTab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";

import TabContent from "@/Components/0_M_TabContent";
import JSON_Content from "@/Components/0_M_JSON_Content";

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
    /**
     * ONLY 1 state to focus 3 Components with same click
     */
    const M_value = use_M_Store((state) => state.M_value);

    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    /**
     * SET SubTab
     */
    const activeSubTab = use_M_Store((state) => state.activeSubTab);
    const setActiveSubTab = use_M_Store((state) => state.setActiveSubTab);

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    /**
     * first M_value on render/refresh
     */
    // const M_value = data[activeSubTab];
    const fieldnames = Object.keys(use_M_Store.getState().M_value || {});
    const activeTab = use_M_Store.getState().activeTab;

    /**
     * 1. subTab set_M_value , when user klick to change SubTab
     * 2. SET default Subtab , if undefined
     * 3. SET default Subtab , if wrong Subtab
     * 4. determin if can_render_TabContent
     */
    const [can_render_TabContent, set_can_render_TabContent] = useState(false);
    useEffect(() => {
        // 1. subTab set_M_value , when user klick to change SubTab
        // use_M_Store.getState().set_M_value(use_M_Store.getState().M_value);
        use_M_Store.getState().set_M_value(M_value);

        if (!activeTab) return; //this was set in M_Store on refresh

        const Default_SubTab = get_Default_SubTab(activeTab);

        // 2. SET default Subtab , if undefined
        if (!activeSubTab) {
            setActiveSubTab(Default_SubTab);
            set_can_render_TabContent(false);
            return;
        }

        /**
         * * 3. SET default Subtab , if wrong Subtab
         * * Object.keys(data) = e.g.
         * * for app_data : f , t
         * * for m_data : d , u , cd , cu , cud , s
         * * for entities : entities
         * *
         * * this failure can happen e.g. on Tab Change
         * * if activeTab and activeSubTab correct
         * * activeTab : app_data
         * * activeSubTab from store: d  (wrong , must be f for app_data)
         */
        if (activeSubTab && !Object.keys(data).includes(activeSubTab)) {
            setActiveSubTab(Default_SubTab);
            set_can_render_TabContent(false);
            return;
        }

        /**
         * * if activeTab and activeSubTab correct)
         * * activeTab : m_data
         * * activeSubTab from store: d
         */
        set_can_render_TabContent(true);
    }, [activeSubTab]); // Reason for Dependency : user klicks tab , data changes

    /**
     * * call when user klicks change tab , to set default subTab
     * @returns default subTab
     */
    function get_Default_SubTab() {
        if (activeTab === "entities") {
            return "entities";
        }

        if (activeTab === "app_data") {
            return "f";
        }

        if (activeTab === "m_data") {
            return "d";
        }
    }

    return (
        <>
            {" "}
            {/* Tab         SubTab */}
            {/* M-DATA      S CD D U CU CUD */}
            {/* APP-DATA    F T */}
            {/* ENTITIES    ENTITIES*/}
            <div className="subtab-container">
                {Object.keys(data)
                    .filter(
                        (subtab) =>
                            typeof data[subtab] === "object" &&
                            data[subtab] !== null,
                    )
                    .map((subtab) => (
                        <button
                            key={subtab}
                            className={`subtab-button ${activeSubTab === subtab ? "active" : ""}`}
                            onClick={() => {
                                setActiveSubTab(subtab);
                            }}
                        >
                            {subtab.toUpperCase()}
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
                    {can_render_TabContent && <TabContent />}
                </div>

                {/* right column = JSON */}
                <div className="column-flex json-preview-column">
                    <JSON_Content />
                </div>
            </div>
        </>
    );
}
