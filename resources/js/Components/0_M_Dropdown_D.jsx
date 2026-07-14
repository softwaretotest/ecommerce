// resources/js/Components/0_M_Dropdown_D.jsx

import { useState, useEffect } from "react";
import { M_value_Service } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";
import { M_Option } from "@/Components/0_M_Option";
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
export function renderDropdown_D(M_Class_Name_List, field_data) {
    const debug = false;
    const fieldDataList = field_data ? field_data.slice(1) : [];

    if (field_data.includes("cd::FOREIGN")) {
        if (debug)
            console.log(
                "1. JKLJKJKLJKLJKLJKLJKLJ - renderDropdown_D - M_Class_Name_List",
                M_Class_Name_List,
            );
        if (debug)
            console.log(
                "1. JKLJKJKLJKLJKLJKLJKLJ - renderDropdown_D - field_data",
                field_data,
            );
        if (debug)
            console.log(
                "1. JKLJKJKLJKLJKLJKLJKLJ - renderDropdown_D - fieldDataList",
                fieldDataList,
            );
    }

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
            typeof valueToTest === "string" && valueToTest.startsWith("d::");

        return isMatch;
    });

    let defaultValue = "";
    let d_params = [];
    /**
     * * D_String_or_Array = e.g. d::INTEGER , u::TEXT , [d:DECIMAL,10,2]
     * */
    if (D_String_or_Array) {
        if (
            Array.isArray(D_String_or_Array) &&
            D_String_or_Array[0].includes("d::")
        ) {
            const [stringValue, ...params] = D_String_or_Array;
            defaultValue = stringValue.split("::")[1];
            d_params = params;
        }
        //case string e.g. u:: and  d::
        if (
            typeof D_String_or_Array === "string" &&
            D_String_or_Array.includes("d::")
        ) {
            defaultValue = D_String_or_Array.split("::")[1];
            d_params = [];
        }
    }
    if (debug)
        console.log(
            "2. JKLJKJKLJKLJKLJKLJKLJ - renderDropdown_D - Dropdown fieldname =",
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
                "3. JKLJKJKLJKLJKLJKLJKLJ - renderDropdown_D - set_D_Action - new_selected_D =",
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
                    // fieldDataList={fieldDataList}
                    field_data={field_data}
                />
            </select>
            {D_Params_State}
        </>
    );
}
