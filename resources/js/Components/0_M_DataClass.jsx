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
        <div className="tab-content-wrapper">
            {/* M-DATA , APP-DATA , ENTITIES */}
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

            {/* 2. พื้นที่แสดงผล */}
            <div className="content-box content-grid">
                {/* คอลัมน์ซ้าย: ช่อง Input */}
                <div className="input-column">
                    <M_DataClass
                        label={activeSubTab}
                        value={data[activeSubTab]}
                        onUpdate={onUpdate}
                    />
                </div>

                {/* คอลัมน์ขวา: JSON Preview */}
                <div className="json-preview-column">
                    <h3 className="json-header">JSON Data</h3>
                    <pre className="json-pre">
                        {JSON.stringify(data[activeSubTab], null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
