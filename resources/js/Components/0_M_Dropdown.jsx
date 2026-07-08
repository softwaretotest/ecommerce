// resources/js/Components/0_M_Dropdown.jsx

import { useState, useEffect } from "react";

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
 * * M_Class_Name_List: e.g. ['d']
 * * fieldDataList: e.g.
 * *     ['d::STRING', 'u::FILE']
 * *     [['d::DECIMAL', 10, 2], "u::NUMBER"]
 * * field_data = e.g. ['image', 'd::STRING', 'u::FILE']
 * *
 * * defaultValue = only for refresh e.g.
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

    /**
     * * foundValue = e.g. d::STRING
     * * .--------------------------
     * * DO NOT CHANGE THIS !!!
     * * M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"))
     * * TO HARDCODE LIKE THIS
     * * const VALID_PREFIXES = ["t::", "f::", "s::", "u::", "d::"];
     * * const foundValue = fieldDataList.find((item, index) => {
     * *    let valueToTest = Array.isArray(item) ? item[0] : item;
     * *
     * *    let isMatch =
     * *        typeof valueToTest === "string" &&
     * *        VALID_PREFIXES.some((prefix) => valueToTest.startsWith(prefix));
     * *
     * *    // [LOG B] see all items , that pass through .find
     * *    console.log(
     * *        `[DEBUG: ${fieldName}] Checking index ${index}:`,
     * *        item,
     * *        " | Match:",
     * *        isMatch,
     * *    );
     * *
     * *    return isMatch;
     * * });
     * *
     * * BECAUSE, IT WILL REMOVE t:: Dropdown its selected values
     */
    const foundValue = fieldDataList.find((item, index) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;

        let isMatch =
            typeof valueToTest === "string" &&
            M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::")); // t:: f:: s:: u:: d::

        // [LOG B] see all items , that pass through .find
        // console.log(
        //     `[DEBUG: ${fieldName}] Checking index ${index}:`,
        //     item,
        //     " | Match:",
        //     isMatch,
        // );

        return isMatch;
    });
    if (fieldName.toUpperCase() === "IMAGE")
        console.log(
            `[DEBUG: ${fieldName}] foundValue after change:`,
            foundValue,
        );
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
            // console.log(`[DEBUG: ${fieldName}] Detected Array params:`, params);
        } else {
            defaultValue = foundValue.split("::")[1];
            field_params = [];
            // [LOG D] if String no params
            // console.log(`[DEBUG: ${fieldName}] Detected String (No params)`);
        }
    } else {
        // console.warn(`[DEBUG: ${fieldName}] No foundValue detected!`);
    }
    // if (fieldName.toUpperCase() === "IMAGE")
    //     console.log(
    //         `[DEBUG: ${fieldName}] New defaultValue calculated:`,
    //         defaultValue,
    //     );

    /**
     * * selected_Value: state from dropdown
     * * handle_Change: update state when option change
     */
    const [selected_Value, set_Selected_Value] = useState(defaultValue);
    // console.log(`[DEBUG: ${fieldName}] Initial defaultValue:`, defaultValue);
    const [Field_Params_State, setField_Params_State] = useState(null);
    useEffect(() => {
        if (fieldName.toUpperCase() === "IMAGE") {
            // [LOG] เช็คว่าค่า params ที่ส่งไปมันใช่ค่าที่ควรจะเป็นไหมในตอนนี้
            console.log(`[DEBUG: ${fieldName}] useEffect triggered!`);
            console.log(
                `[DEBUG: ${fieldName}] Current selected_Value:`,
                selected_Value,
            );
            console.log(
                `[DEBUG: ${fieldName}] Current field_params (fixed):`,
                field_params,
            );
        }
        setField_Params_State(
            <Field_Params
                param_name={selected_Value}
                field_params={field_params}
            />,
        );
    }, [selected_Value, defaultValue]);

    // useEffect(() => {
    //     console.log(
    //         `[DEBUG: ${fieldName}] selected_Value updated to:`,
    //         selected_Value,
    //     );
    //     set_Selected_Value(defaultValue);
    // }, [defaultValue]);

    return (
        <>
            <select
                className="M_field-dropdown"
                defaultValue={defaultValue}
                key={defaultValue}
                onChange={(e) => {
                    // [LOG 3: ตรวจสอบค่าที่เลือกจาก UI]
                    // console.log(
                    //     `[DEBUG: ${fieldName}] onChange triggered, New Value:`,
                    //     e.target.value,
                    // );
                    // console.log("!!!!!!!!!! selected_Value = ", selected_Value);

                    set_Selected_Value(e.target.value);
                }}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    fieldDataList={fieldDataList}
                />
            </select>
            {field_params.length > 0 && Field_Params_State}
        </>
    );
}
