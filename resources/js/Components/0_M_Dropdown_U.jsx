// resources/js/Components/0_M_Dropdown_U.jsx

import { useState, useEffect } from "react";

import { M_Option } from "@/Components/0_M_Option";
import { D_Params } from "@/Components/0_M_D_Params";
import { D_PARAMS_MAP } from "@/Components/0_M_MAP";
import { prepare_new_M_value_for_Update_U } from "@/Components/0_M_value_Updater_U";
import JSON_Content from "@/Components/0_M_JSON_Content";

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "@/Services/0_M_value_Service";
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";

/**
 * Renders a dropdown select element
 * *
 * * Example usage:
 * * M_Class_Name_List: e.g. ['d']
 * * field_data = e.g. ['image', 'u::STRING', 'u::FILE']
 * *
 * * defaultValue = only for refresh e.g.
 * * <select defaultValue="ORDER_NR"> ... </select>
 * *
 * * Params:
 * * defaultValue = field name , e.g. DECIMAL , STRING
 * * D_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown_U(M_Class_Name_List, field_data) {
    const { M_value, set_M_value, activeField, setActiveField } = use_M_Store();

    const fieldname = field_data[0];
    const fieldDataList = field_data ? field_data.slice(1) : [];

    /**
     * U_String = e.g. u::INTEGER , [d:DECIMAL,10,2]
     */
    const U_String = fieldDataList.find((item) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;

        /**
         * u::
         */
        let isMatch =
            typeof valueToTest === "string" && valueToTest.startsWith("u::");

        return isMatch;
    });

    let defaultValue = "";
    let D_params = [];
    /**
     * * U_String = e.g. u::TEXT , [d:DECIMAL,10,2]
     * */
    if (U_String) {
        if (Array.isArray(U_String)) {
            const [stringValue, ...params] = U_String;
            defaultValue = stringValue.split("::")[1];
            D_params = params;
        }
        //case string e.g. u:: and  u::
        if (
            typeof U_String === "string" ||
            U_String.includes("u::") ||
            U_String.includes("u::")
        ) {
            defaultValue = U_String.split("::")[1];
            D_params = [];
        }
    }
    // console.log(
    //     ")=)=)=)=)=)=) Dropdown fieldname =",
    //     fieldname.padEnd(13),
    //     "\t D_params =",
    //     D_params,
    //     "\t\t U_String =",
    //     U_String,
    // );
    /**
     * * selected_U: state from dropdown e.g. STRING , DECIMAL , INTEGER
     * * handle_Change: update state when option change
     */
    const [selected_U, set_Selected_U] = useState(defaultValue);

    /**
     * * set_Selected_U
     * * prepare_new_M_value_for_Update_U
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_U_Actions(event) {
        const new_selected_U = event.target.value;

        // update UI
        set_Selected_U(new_selected_U);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update_U(
            M_value,
            fieldname,
            new_selected_U,
        );

        await M_value_Service.update(new_M_value);
    }

    return (
        <>
            <select
                className="M_field-dropdown"
                value={selected_U}
                key={defaultValue}
                onChange={(event) => {
                    set_U_Actions(event);
                }}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    field_data={field_data}
                />
            </select>
        </>
    );
}
