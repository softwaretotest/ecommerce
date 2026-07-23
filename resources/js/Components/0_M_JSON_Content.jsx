// resources/js/Components/0_M_JSON_Content.jsx
import { useEffect, useRef, useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { M_value_Service } from "@/Services/0_M_value_Service";
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";
import { use_M_Data } from "@/Providers/0_M_DataProvider";

/**
 * * Flow_JSON_Content_SELF-UPDATE
 * ----------------------------------
 * 1. User Action: UI update -> M_value change
 * 2. DataProvider Detection: useEffect watches M_value
 * 3. Data Fetching: API call to Backend
 * 4. Synchronization: Update GLOBAL_METADATA -> Set hasJSON_Change(true)
 * 5. JSON_Content Response: Detect change -> Access updated GLOBAL_METADATA
 */
export default function JSON_Content() {
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeSubTab = use_M_Store((state) => state.activeSubTab);
    const hasJSON_Change = use_M_Store((state) => state.hasJSON_Change);
    const set_hasJSON_Change = use_M_Store((state) => state.set_hasJSON_Change);

    const data = use_M_Data();
    const [displayData, setDisplayData] = useState(null);

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    /** renderArrayItem = e.g.
        "price",
        [
            "d::DECIMAL",
            10,
            2
        ]
     */
    const renderArrayItem = (value, depth = 0) => {
        if (Array.isArray(value)) {
            return (
                <div className="json-array">
                    [
                    {value.map((item, i) => (
                        <div key={i} className="json-item">
                            {renderArrayItem(item, depth + 1)}
                            {i < value.length - 1 ? "," : ""}
                        </div>
                    ))}
                    ]
                </div>
            );
        }
        return <span className="json-primitive">{JSON.stringify(value)}</span>;
    };

    useEffect(() => {
        if (!data) return;

        setDisplayData(data);

        if (hasJSON_Change) {
            set_hasJSON_Change(false);
        }
    }, [hasJSON_Change, data, activeSubTab]);

    if (!displayData) {
        return <div>loading data...</div>;
    }

    /**
     * * to prevent null
     * * this component will render
     * * if the state displayData has data in it
     */
    return (
        <>
            {" "}
            <h3 className="json-header">JSON Data</h3>
            <div className="json-preview-container">
                <div className="json-list">
                    {Object.entries(data[activeTab][activeSubTab]).map(
                        //M_value = data[activeTab][activeSubTab]
                        ([fieldname, value]) => (
                            <div
                                key={fieldname} //fieldname = e.g. PRICE , STOCK etc.
                                ref={(DOM_Node) =>
                                    (scrollRefs.current[fieldname] = DOM_Node)
                                }
                                className={`json-line ${activeField === fieldname ? "json-highlight" : ""}`}
                                onClick={() => {
                                    // fieldname = null , when field deleted
                                    if (fieldname) setActiveField(fieldname);
                                }}
                            >
                                <span className="json-fieldname">
                                    "{fieldname}"
                                </span>
                                : {renderArrayItem(value, 1)}
                            </div>
                        ),
                    )}
                </div>
            </div>
        </>
    );
}
