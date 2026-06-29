// resources/js/Hooks/use_M_Option.jsx

import { use_M_Data } from "@/Providers/0_M_DataProvider.jsx";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

/**
 * Get options for dropdown or checkbox based on Class Name
 * * Example usage:
 * * M_Class_Name: "entities" -> uses metadata.m_data
 * * M_Class_Name: "f"        -> uses metadata.app_data
 */
export function use_M_Option() {
    const metadata = use_M_Data();
    const activeTab = use_M_Store((state) => state.activeTab);

    const getOptions = (M_Class_Name) => {
        if (activeTab === "app_data") {
            const data = metadata?.m_data?.[M_Class_Name];
            if (!data) return [];

            // for Object and Array
            return Array.isArray(data) ? data.sort() : Object.keys(data).sort();
        }

        if (activeTab === "entities") {
            const data = metadata?.app_data?.[M_Class_Name];
            if (!data) return [];

            // for Object and Array
            return Array.isArray(data) ? data.sort() : Object.keys(data).sort();
        }
    };

    return { getOptions };
}
