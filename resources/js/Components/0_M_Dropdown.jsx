// resources/js/Components/0_M_Dropdown.jsx

import { useState, useEffect } from "react";

import { use_M_Option } from "@/Hooks/use_M_Option";
import { use_M_Store } from "@/Stores/0_M_Store";
import { Field_Params } from "@/Components/0_M_Field_Params";
import { FIELD_PARAMS_MAP } from "@/Components/0_M_MAP";

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
 * *     ['d::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', true]]
 * *     ['cd::FOREIGN']
 * * field_data = e.g. ['image', 'd::STRING', 'u::FILE']
 * *
 * * defaultValue = only for refresh e.g.
 * * <select defaultValue="ORDER_NR"> ... </select>
 * *
 * * Params:
 * * defaultValue = field name , e.g. DECIMAL , STRING
 * * field_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown(
    M_Class_Name_List,
    fieldDataList = [],
    field_data,
) {
    if (fieldDataList.includes("cd::FOREIGN")) return; // FK need no other setting

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

        return isMatch;
    });

    let defaultValue = "";
    let field_params = [];

    if (foundValue) {
        if (Array.isArray(foundValue)) {
            const [stringValue, ...params] = foundValue;
            defaultValue = stringValue.split("::")[1];
            field_params = params;
        } else {
            defaultValue = foundValue.split("::")[1];
            field_params = [];
        }
    }

    /**
     * * selected_Value: state from dropdown
     * * handle_Change: update state when option change
     */
    const [selected_Value, set_Selected_Value] = useState(defaultValue);

    const [Field_Params_State, setField_Params_State] = useState(null);

    useEffect(() => {
        const field_params = find_NEW_Field_Params_in_M_MAP(selected_Value);
        setField_Params_State(
            <Field_Params
                param_name={selected_Value}
                field_params={field_params}
            />,
        );
    }, [selected_Value]);

    /**
     * prepare field_params for React.Component <Field_Params />
     * @param {*} D_Name_UPPERCASE
     * @returns field_params = e.g. [10 , 2] for [DECIMAL,10,2]
     */
    function find_NEW_Field_Params_in_M_MAP(D_Name_UPPERCASE) {
        const definition = FIELD_PARAMS_MAP[D_Name_UPPERCASE];
        let field_params = definition?.map((param) => param.default);
        return field_params;
    }

    return (
        <>
            <select
                className="M_field-dropdown"
                defaultValue={defaultValue}
                key={defaultValue}
                onChange={(e) => {
                    set_Selected_Value(e.target.value);
                }}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    fieldDataList={fieldDataList}
                />
            </select>
            {Field_Params_State}
        </>
    );
}
