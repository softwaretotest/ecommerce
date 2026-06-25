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

    return (
        <div>
            {/* S CD D U CU CUD */}
            <div className="subtabs-container">
                {subTabs.map((M_Class_Name) => (
                    <button
                        key={M_Class_Name}
                        onClick={() => {
                            setActiveSubTab(M_Class_Name);
                        }}
                        className={`subtab-button ${activeSubTab === M_Class_Name ? "active" : ""}`}
                    >
                        {M_Class_Name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* show 2 column */}
            <div className="content-box content-grid">
                {/* left column = Input Boxes */}
                <div className="column-flex">
                    <TabContent
                        M_Class_Name={activeSubTab}
                        M_value={data[activeSubTab]}
                        onUpdate={onUpdate}
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
