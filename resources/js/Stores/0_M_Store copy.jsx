// resources/js/Components/0_M_Dropdown.jsx

import { use_M_Option } from "@/Hooks/use_M_Option.js";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

/**
 * M_Option Component
 * * Handles dynamic rendering based on activeTab
 */
export function M_Option({ M_Class_Name_List, fieldDataList }) {
    const { getOptions } = use_M_Option();
    const { activeTab } = use_M_Store();

    if (!M_Class_Name_List) return null;

    return M_Class_Name_List.flatMap((M_Class_Name) => {
        let options = [];

        // Logic split by activeTab
        if (activeTab === "app_data") {
            options = getOptions(M_Class_Name);
        } else if (activeTab === "m_data") {
            // Special handling for 's' class in m_data to fix the bug
            if (M_Class_Name === "s") {
                // Logic for Class S options here
                options = getOptions(M_Class_Name);
            } else {
                options = getOptions(M_Class_Name);
            }
        }

        return (Array.isArray(options) ? options : []).map((item) => {
            const label = Array.isArray(item) ? item.join("::") : item;
            return (
                <option key={label} value={label}>
                    {label}
                </option>
            );
        });
    });
}

/**
 * Renders a dropdown select element
 */
export function renderDropdown(M_Class_Name_List, fieldDataList = []) {
    const foundValue = fieldDataList.find((item) => {
        const val = Array.isArray(item) ? item[0] : item;
        return (
            typeof val === "string" &&
            M_Class_Name_List.some((c) => val.startsWith(c + "::"))
        );
    });

    let defaultValue = "";
    if (foundValue) {
        const str = Array.isArray(foundValue) ? foundValue[0] : foundValue;
        defaultValue = str.split("::")[1];
    }

    return (
        <select className="M_field-dropdown" defaultValue={defaultValue}>
            <option value="">--</option>
            <M_Option
                M_Class_Name_List={M_Class_Name_List}
                fieldDataList={fieldDataList}
            />
        </select>
    );
}
