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
 * * M_Class_Name_List: e.g. ['u']  ['cu']
 * * field_data = e.g. ['image', 'd::STRING', 'u::FILE']
 * *
 * * defaultValue = only for refresh e.g.
 * * <select defaultValue="NUMBER"> ... </select>
 * *
 * * Params:
 * * defaultValue = fieldname , e.g. NUMBER , FILE , TEXT
 */
export function renderDropdown_U(M_Class_Name_List, field_data) {
    const { M_value, set_M_value, activeField, setActiveField } = use_M_Store();

    const fieldname = field_data[0];
    const fieldDataList = field_data ? field_data.slice(1) : [];

    /**
     * U_String = e.g. u::NUMBER , u::FILE , u::TEXT
     */
    const U_String = fieldDataList.find((item) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;

        let isMatch =
            typeof valueToTest === "string" && valueToTest.startsWith("u::");

        return isMatch;
    });

    let defaultValue = "";
    /**
     * * U_String = e.g. u::TEXT , [d:DECIMAL,10,2]
     * */
    if (U_String && U_String.startsWith("u::")) {
        //case string e.g. u:: and  u::
        defaultValue = U_String.split("::")[1];
    }

    // console.log(
    //     ")=)=)=)=)=)=) Dropdown_U fieldname =",
    //     fieldname.padEnd(13),
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
            new_selected_U,
            M_value,
        );

        await M_value_Service.update(new_M_value);
    }

    return (
        <>
            <select
                className="M_field-dropdown"
                value={selected_U}
                // key={defaultValue}  // no need if react does not warn
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
