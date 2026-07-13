// resources/js/Components/0_M_Dropdown_D.jsx

import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { use_M_Option } from "@/Hooks/use_M_Option";
import { M_value_Service } from "../Services/0_M_value_Service";

import { D_Params } from "@/Components/0_M_D_Params";
import { D_HEAL } from "@/Components/0_M_Dropdown_D_HEAL";

import { prepare_new_M_value_for_Update_D } from "@/Components/0_M_value_Updater_D";
import {
    find_NEW_D_Params_in_M_MAP,
    find_D_Params_in_GLOBAL_METADATA,
} from "@/Components/0_M_D_Params_Service";

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
 * * d_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown_D(
    M_Class_Name_List,
    fieldDataList = [],
    field_data,
) {
    const debug = false;
    if (fieldDataList.includes("cd::FOREIGN")) return; // FK need no other setting
    const {
        M_value,
        set_M_value,
        activeField,
        setActiveField,
        d_Arrays_healed,
        set_d_Arrays_healed,
        isLastField,
        set_isLastField,
    } = use_M_Store();

    const fieldname = field_data[0];

    /**
     * * D_String_or_Array = e.g. d::INTEGER , [d:DECIMAL,10,2]
     * * .--------------------------
     * * DO NOT CHANGE THIS !!!
     * * M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"))
     * * TO HARDCODE LIKE THIS
     * * const VALID_PREFIXES = ["t::", "f::", "s::", "u::", "d::"];
     * * const D_String_or_Array = fieldDataList.find((item, index) => {
     * *    let valueToTest = Array.isArray(item) ? item[0] : item;
     * *
     * *    let isMatch =
     * *        typeof valueToTest === "string" &&
     * *        VALID_PREFIXES.some((prefix) => valueToTest.startsWith(prefix));
     * *
     * *    // [LOG B] see all items , that pass through .find
     * *    if(debug) console.log(
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
    const D_String_or_Array = fieldDataList.find((item) => {
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
    let d_params = [];
    /**
     * * D_String_or_Array = e.g. d::INTEGER , u::TEXT , [d:DECIMAL,10,2]
     * */
    if (D_String_or_Array) {
        if (Array.isArray(D_String_or_Array)) {
            const [stringValue, ...params] = D_String_or_Array;
            defaultValue = stringValue.split("::")[1];
            d_params = params;
        }
        //case string e.g. u:: and  d::
        if (
            typeof D_String_or_Array === "string" ||
            D_String_or_Array.includes("u::") ||
            D_String_or_Array.includes("d::")
        ) {
            defaultValue = D_String_or_Array.split("::")[1];
            d_params = [];
        }
    }
    if (debug)
        console.log(
            ")=)=)=)=)=)=) Dropdown fieldname =",
            fieldname.padEnd(13),
            "\t d_params =",
            d_params,
            "\t\t D_String_or_Array =",
            D_String_or_Array,
        );

    /**
     * * selected_D: state from dropdown e.g. STRING , DECIMAL , INTEGER
     * * handle_Change: update state when option change
     */
    const [selected_D, set_Selected_D] = useState(defaultValue);

    const [D_Params_State, setD_Params_State] = useState(null);

    useEffect(() => {
        if (!selected_D) return;
        let d_params = find_D_Params_in_GLOBAL_METADATA(selected_D, fieldname);
        let is_wrong_d_params_in_backend = false;
        if (!d_params) {
            is_wrong_d_params_in_backend = true;
            d_params = find_NEW_D_Params_in_M_MAP(selected_D);
        }

        setD_Params_State(<D_Params D_NAME={selected_D} d_params={d_params} />);
        if (is_wrong_d_params_in_backend) {
            D_HEAL(fieldname, selected_D, M_value, d_params, M_value_Service);
        }
    }, [selected_D]);

    /**
     * * set_Selected_D
     * * prepare_new_M_value_for_Update_D
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_D_Actions(event) {
        const new_selected_D = event.target.value;
        if (debug)
            console.log(
                "PèPèPèPèPèPèPèPèPè Dropdown_D - set_D_Action - new_selected_D =",
                new_selected_D,
            );
        // update UI
        set_Selected_D(new_selected_D);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update_D(
            new_selected_D,
            fieldname,
            M_value,
        );

        await M_value_Service.update(new_M_value);
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
            {D_Params_State}
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
