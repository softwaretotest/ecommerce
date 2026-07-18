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

import { find_d_item, has_d_in_field_data } from "@/Components/0_M_Data_Helper";

/**
 * Renders a dropdown select element
 * *
 * * Example usage:
 * * M_Class_Name_List: e.g. ['d']
 * * field_data = e.g. ['image', 'd::STRING', 'u::FILE']
 * *
 * * selected_D_of_field_data = only for refresh e.g.
 * * <select selected_D_of_field_data="ORDER_NR"> ... </select>
 * *
 * * Params:
 * * selected_D_of_field_data = field name , e.g. DECIMAL , STRING
 * * d_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown_D(M_Class_Name_List, field_data) {
    // const debug = true;
    const debug = false && field_data[0] === "image";

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
    }

    const {
        M_value,
        set_M_value,
        activeField,
        setActiveField,
        isLastField,
        set_isLastField,
    } = use_M_Store();

    const fieldname = field_data[0];

    /**
     * * D_String_or_Array = e.g. d::INTEGER , [d:DECIMAL,10,2]
     */
    const D_String_or_Array = find_d_item(field_data);
    // const D_String_or_Array = field_data.find((item, index) => {
    //     let valueToTest = Array.isArray(item) ? item[0] : item;
    //     let isMatch =
    //         typeof valueToTest === "string" && valueToTest.startsWith("d::");
    //     return isMatch;
    // });

    let selected_D_of_field_data = "";
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
            selected_D_of_field_data = stringValue.split("::")[1];
            d_params = params;
        }
        //case string e.g. u:: and  d::
        if (
            typeof D_String_or_Array === "string" &&
            D_String_or_Array.includes("d::")
        ) {
            selected_D_of_field_data = D_String_or_Array.split("::")[1];
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
    const selected_D = use_M_Store((state) => state.selected_D);
    const set_selected_D = use_M_Store.getState().set_selected_D;
    const set_selected_D_latest = use_M_Store.getState().set_selected_D_latest;

    const selected_D_to_show =
        selected_D[fieldname] !== undefined
            ? selected_D[fieldname]
            : selected_D_of_field_data;

    const [D_Params_State, setD_Params_State] = useState(null);

    useEffect(() => {
        if (!selected_D_to_show) return;
        let d_params = find_D_Params_in_GLOBAL_METADATA(
            selected_D_to_show,
            fieldname,
        );
        let is_wrong_d_params_in_backend = false;
        if (!d_params) {
            is_wrong_d_params_in_backend = true;
            d_params = find_NEW_D_Params_in_M_MAP(selected_D_to_show);
        }

        const selected_D_values = selected_D[fieldname];

        const has_FOREIGN =
            (Array.isArray(selected_D_values) ||
                typeof selected_D_values === "string") &&
            selected_D_values.includes("FOREIGN");

        has_FOREIGN &&
            setD_Params_State(
                <D_Params D_NAME={selected_D_to_show} d_params={d_params} />,
            );
        if (is_wrong_d_params_in_backend) {
            D_HEAL(
                fieldname,
                selected_D_to_show,
                M_value,
                d_params,
                M_value_Service,
            );
        }
    }, [selected_D]);

    /**
     * * set_selected_D
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
        set_selected_D(fieldname, new_selected_D);

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
                value={selected_D_to_show}
                // key={selected_D_of_field_data} // no need if react does not warn
                disabled={use_M_Store
                    .getState()
                    .checked_CD[fieldname]?.includes("FOREIGN")}
                onChange={(event) => {
                    // 1. ทำ Deep Clone
                    const deep_copied_selected_D = JSON.parse(
                        JSON.stringify(use_M_Store.getState().selected_D),
                    );

                    // 2. บันทึก latest
                    use_M_Store
                        .getState()
                        .set_selected_D_latest(
                            fieldname,
                            deep_copied_selected_D,
                        );

                    // 3. ส่ง event เข้าไปตรงๆ เพื่อให้ set_CD_Actions อ่านค่า event.target.checked ได้
                    set_D_Actions(event, fieldname);
                }}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    field_data={field_data}
                />
            </select>
            {has_d_in_field_data(field_data) && D_Params_State}
        </>
    );
}
