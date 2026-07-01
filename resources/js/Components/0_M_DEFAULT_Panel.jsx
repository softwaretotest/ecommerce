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
    // 1. Find the default value
    const defaultItem = field_data.find(
        (item) => Array.isArray(item) && item[0] === "cd::DEFAULT",
    );

    // 2. Find Data Type (d::)
    const dTypeItem = field_data.find(
        (item) => typeof item === "string" && item.startsWith("d::"),
    );

    const dType = dTypeItem ? dTypeItem : "d::STRING";

    // 3. Logic to handle display rules
    if (!defaultItem || defaultItem[1] === null) {
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
