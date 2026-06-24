// resources/js/Components/0_M_TabContent.jsx
import React, { useState } from "react";
import M_DataClass from "./0_M_DataClass";
import "../../css/0_M_UI.css";

export default function TabContent({ data, onUpdate }) {
    if (!data) return <div>ไม่มีข้อมูล</div>;

    const subTabs = Object.keys(data).filter(
        (key) => typeof data[key] === "object",
    );
    const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

    return (
        <div>
            {/* S CD D U CU CUD */}
            <div className="subtabs-container">
                {subTabs.map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveSubTab(key)}
                        className={`subtab-button ${activeSubTab === key ? "active" : ""}`}
                    >
                        {key.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* show 2 column */}
            <div className="content-box content-grid">
                {/* left column = Input Boxes */}
                <div className="column-flex">
                    <M_DataClass
                        label={activeSubTab}
                        value={data[activeSubTab]}
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
