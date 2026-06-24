import React, { useState } from "react";
import { use_M_Data } from "@/Services/0_M_DataProvider";
import TabContent from "@/Components/0_M_TabContent.jsx";
import "@/../css/0_M_UI.css";

export default function M_Dashboard() {
    const data = use_M_Data();
    const [activeTab, setActiveTab] = useState("m_data");

    if (!data) return <div>Loading...</div>;

    const tabs = [
        { id: "m_data", label: "M_DATA", key: "m_data" },
        { id: "app_data", label: "APP_DATA", key: "app_data" },
        { id: "entities", label: "ENTITIES", key: "entities" },
    ];

    return (
        <div className="dashboard-wrapper">
            <h1 className="dashboard-header">Project M Dashboard</h1>

            <div className="tab-switcher-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="dashboard-main-box">
                {/* ส่งข้อมูลเฉพาะส่วนที่เลือกไปที่ TabContent */}
                {activeTab === "m_data" && <TabContent data={data.m_data} />}
                {activeTab === "app_data" && (
                    <TabContent data={data.app_data} />
                )}
                {activeTab === "entities" && (
                    <TabContent data={data.entities} />
                )}
            </div>
        </div>
    );
}
