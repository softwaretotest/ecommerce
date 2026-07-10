// resources/js/Hooks/use_M_Option.jsx

import { use_M_Data } from "@/Providers/0_M_DataProvider.jsx";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

/**
 * Format data into a sorted array of strings
 * * Example:
 * * data: {EMAIL: [], CURRENCY: []} -> ["CURRENCY", "EMAIL"]
 * * data: ["A", "B"] -> ["A", "B"]
 */
const formatData = (data) =>
    Array.isArray(data) ? data.sort() : Object.keys(data).sort();

/**
 * Get options for dropdown or checkbox based on Class Name
 * * Example usage:
 * * M_Class_Name: "entities" -> uses metadata.m_data
 * * M_Class_Name: "f"        -> uses metadata.app_data
 * *
 * * else if (activeTab === "m_data")
 * * here for Class s Definition in m_data
 * *
 * * M_Class_Name === "s" some entitiy (DB_Table) has Class s fields
 */
export function use_M_Option() {
    const metadata = use_M_Data();
    const activeTab = use_M_Store((state) => state.activeTab);

    const getOptions = (M_Class_Name) => {
        let rawData;

        // เช็คว่า metadata มีตัวตนหรือไม่ก่อนทำอะไรต่อ
        if (!metadata) {
            console.error(
                `[DEBUG ERROR] Metadata is missing/null in use_M_Option for class: ${M_Class_Name}`,
            );
            throw new Error(`Metadata is missing!`);
        }

        if (activeTab === "app_data") {
            rawData =
                metadata?.m_data?.[M_Class_Name] ||
                metadata?.app_data?.[M_Class_Name];
        } else if (activeTab === "entities") {
            rawData =
                M_Class_Name === "s"
                    ? metadata?.m_data?.[M_Class_Name]
                    : metadata?.app_data?.[M_Class_Name];
        } else if (activeTab === "m_data") {
            rawData = metadata?.m_data?.[M_Class_Name];
        } else {
            console.error(`[DEBUG ERROR] Unknown activeTab: ${activeTab}`);
            throw new Error(`Unknown activeTab: ${activeTab}`);
        }

        if (!rawData) {
            console.error(
                `[DEBUG ERROR] Data not found for M_Class_Name: "${M_Class_Name}" in activeTab: "${activeTab}"`,
            );
            console.log("Current metadata state:", metadata);
            throw new Error(`No data found for class: ${M_Class_Name}`);
        }

        return formatData(rawData);
    };

    return { getOptions };
}
