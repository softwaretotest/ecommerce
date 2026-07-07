// resources/js/Components/0_M_Dropdown.jsx

import { use_M_Option } from "@/Hooks/use_M_Option.js";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { Field_Params } from "@/Components/0_M_Field_Params.jsx";

export function M_Option({ M_Class_Name_List, fieldDataList }) {
    const { getOptions } = use_M_Option(); // ดึงจาก Hook โดยตรง

    if (!M_Class_Name_List) return null;
    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name); // use getOptions from Hook

        return options.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));
    });
}

/**
 * Renders a dropdown select element
 * *
 * * Example usage:
 * * M_Class_Name_List: ["f"]
 * * fieldDataList: ["f::ORDER_NR"]
 * *
 * * Result:
 * * <select defaultValue="ORDER_NR"> ... </select>
 * *
 * * Params:
 * * defaultValue = field name , e.g. DECIMAL , STRING
 * * field_params = e.g. for DECIMAL ( total_digit , scale )
 * *
 */
export function renderDropdown(
    M_Class_Name_List,
    fieldDataList = [],
    field_data,
) {
    const { M_value, activeTab, activeSubTab } = use_M_Store();
    const fieldName = field_data ? field_data[0] : "UNKNOWN";

    // [LOG A] fieldDataList
    console.log(
        `[DEBUG: ${fieldName}] Full fieldDataList:`,
        JSON.parse(JSON.stringify(fieldDataList)),
    );

    const foundValue = fieldDataList.find((item, index) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;

        let isMatch =
            typeof valueToTest === "string" && valueToTest.startsWith("d::");

        // [LOG B] see all items , that pass through .find
        console.log(
            `[DEBUG: ${fieldName}] Checking index ${index}:`,
            item,
            " | Match:",
            isMatch,
        );

        return isMatch;
    });

    // [LOG C] see foundValue of fieldname
    console.log(`[DEBUG: ${fieldName}] Selected foundValue:`, foundValue);

    let defaultValue = "";
    let field_params = [];

    if (foundValue) {
        if (Array.isArray(foundValue)) {
            const [stringValue, ...params] = foundValue;
            defaultValue = stringValue.split("::")[1];
            field_params = params;
            // [LOG D] if Array must see params
            console.log(`[DEBUG: ${fieldName}] Detected Array params:`, params);
        } else {
            defaultValue = foundValue.split("::")[1];
            field_params = [];
            // [LOG D] if String no params
            console.log(`[DEBUG: ${fieldName}] Detected String (No params)`);
        }
    } else {
        console.warn(`[DEBUG: ${fieldName}] No foundValue detected!`);
    }

    return (
        <>
            <select
                className="M_field-dropdown"
                defaultValue={defaultValue}
                key={defaultValue}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    fieldDataList={fieldDataList}
                />
            </select>
            {field_params.length > 0 && (
                <Field_Params
                    param_name={defaultValue}
                    field_params={field_params}
                />
            )}
        </>
    );
}
