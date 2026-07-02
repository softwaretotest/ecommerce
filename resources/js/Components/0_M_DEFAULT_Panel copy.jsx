// 0_M_DEFAULT_Panel.jsx

import { use_M_Store } from "@/Stores/0_M_Store";

/**
 * Render input field for DEFAULT parameter based on field type
 * *
 * * Example usage:
 * * fieldname: "f::PRICE"
 * * DEFAULT_Panel: ["cd::DEFAULT", 0]
 * *
 * * Result:
 * * <div className="M_params-container">
 * * <span className="M_params-label">Default:</span>
 * * <input className="M_params-input" type="number" value="0" />
 * * </div>
 * *
 * * e.g. DEFAULT_Panel = [d::DEFAULT, 10, 2]
 */
export function DEFAULT_Panel({ field_data }) {
    const M_value = use_M_Store((state) => state.M_value);
    const fieldname = field_data[0];

    console.log("0_M_DEFAULT_Panel - [1] fieldname:", fieldname);
    console.log("0_M_DEFAULT_Panel - [2] M_value:", M_value);

    // 1. Find the default value
    // เราจะใช้ M_value[fieldname.toUpperCase()] ถ้าไม่มีถึงจะใช้ field_data
    const upperFieldName = fieldname.toUpperCase();
    const sourceData = M_value ? M_value[upperFieldName] : null;
    const effectiveData = sourceData || field_data;

    console.log("0_M_DEFAULT_Panel - [3] effectiveData:", effectiveData);

    const defaultItem = effectiveData.find(
        (item) => Array.isArray(item) && item[0] === "cd::DEFAULT",
    );
    console.log("0_M_DEFAULT_Panel - [4] defaultItem:", defaultItem);

    // 2. Find Data Type (d::)
    const dTypeItem = effectiveData.find(
        (item) => typeof item === "string" && item.startsWith("d::"),
    );
    const dType = dTypeItem ? dTypeItem : "d::STRING";
    console.log("0_M_DEFAULT_Panel - [5] dType:", dType);

    // 3. Logic to handle display rules
    if (!defaultItem || defaultItem[1] === null || defaultItem[1] === "---") {
        console.log(
            "0_M_DEFAULT_Panel - [6] Result: Displaying 'Not set' input",
        );
        return (
            <input
                className="DEFAULT_Panel"
                type="text"
                placeholder="Not set"
                disabled
            />
        );
    }

    const value = defaultItem[1];
    console.log("0_M_DEFAULT_Panel - [7] Final value to render:", value);

    switch (dType) {
        case "d::BOOLEAN":
            return (
                <select
                    className="DEFAULT_Panel"
                    defaultValue={value ? "true" : "false"}
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            );
        case "d::DECIMAL":
        case "d::INTEGER":
            return (
                <input
                    className="DEFAULT_Panel"
                    type="number"
                    defaultValue={value}
                />
            );
        case "d::STRING":
        default:
            return (
                <input
                    className="DEFAULT_Panel"
                    type="text"
                    defaultValue={value}
                />
            );
    }
}
