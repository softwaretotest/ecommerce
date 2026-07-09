// resources/js/Components/0_M_Dropdown.jsx

import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { use_M_Option } from "@/Hooks/use_M_Option";
import { M_value_Service } from "../Services/0_M_value_Service";

import { Field_Params } from "@/Components/0_M_Field_Params";
import { FIELD_PARAMS_MAP } from "@/Components/0_M_MAP";
import { prepare_new_M_value_for_Update_D } from "@/Components/0_M_value_Updater_D";

import JSON_Content from "./0_M_JSON_Content";

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
    const { M_value, set_M_value, activeField, setActiveField } = use_M_Store();
    const setJSON_Content_State = use_M_Store(
        (state) => state.setJSON_Content_State,
    );

    const fieldname = field_data[0];

    /**
     * * foundValue = e.g. d::INTEGER , [d:DECIMAL,10,2]
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
     * *        `[DEBUG: ${fieldname}] Checking index ${index}:`,
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

        /**
         * // t:: f:: s:: u:: d::
         */
        let isMatch =
            typeof valueToTest === "string" &&
            M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"));

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
     * * selected_D: state from dropdown e.g. STRING , DECIMAL , INTEGER
     * * handle_Change: update state when option change
     */
    const [selected_D, set_Selected_D] = useState(defaultValue);

    const [Field_Params_State, setField_Params_State] = useState(null);

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

    useEffect(() => {
        if (!selected_D) return;
        const field_params = find_NEW_Field_Params_in_M_MAP(selected_D);
        setField_Params_State(
            <Field_Params
                param_name={selected_D}
                field_params={field_params}
            />,
        );
        // }
    }, [selected_D]);

    /**
     * * set_Selected_D
     * * prepare_new_M_value_for_Update_D
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_D_Actions(event) {
        const new_selected_D = event.target.value;

        // update UI
        set_Selected_D(new_selected_D);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update_D(
            M_value,
            fieldname,
            new_selected_D,
        );

        // update M_Store
        set_M_value(new_M_value);

        // update JSON files on Backend
        await M_value_Service.update(new_M_value);

        // update JSON View
        setJSON_Content_State(
            <JSON_Content
                M_value={new_M_value}
                activeField={activeField}
                setActiveField={setActiveField}
            />,
        );
    }

    return (
        <>
            <select
                className="M_field-dropdown"
                value={selected_D}
                key={defaultValue}
                onChange={(event) => {
                    set_D_Actions(event);
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

/**
 * Prepare options for Dropdown D , U
 * @param {*} M_Class_Name_List
 * * M_Class_Name_List: e.g. ['d']
 * @param {*} fieldDataList
 * * fieldDataList: e.g.
 * *     ['d::STRING', 'u::FILE']
 * *     [['d::DECIMAL', 10, 2], "u::NUMBER"]
 * *     ['d::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', true]]
 * *     ['cd::FOREIGN']
 * @returns options for <select>
 */
export function M_Option({ M_Class_Name_List, fieldDataList = [] }) {
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
