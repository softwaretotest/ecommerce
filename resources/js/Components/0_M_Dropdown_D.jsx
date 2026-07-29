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
    find_D_Params_in_M_value,
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

    // const M_value = use_M_Store.getState((state) => state.M_value);
    // const NEW_added_fieldname = use_M_Store.getState((state) => state.NEW_added_fieldname);

    /**
     * * M_value, NEW_added_fieldname must be scripted together
     * * to make FOREIGN Actions working
     */
    const { M_value, NEW_added_fieldname } = use_M_Store();

    const set_M_value = use_M_Store.getState().set_M_value;
    const activeField = use_M_Store.getState().activeField;

    const fieldname = field_data[0];

    /**
     * * D_String_or_Array = e.g. d::INTEGER , [d:DECIMAL,10,2]
     */
    const D_String_or_Array = find_d_item(field_data);

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

    const set_D_Params_State = use_M_Store.getState().set_D_Params_State;

    const selected_D_to_show =
        selected_D[fieldname] !== undefined
            ? selected_D[fieldname]
            : selected_D_of_field_data;

    /**
     * * this useEffect handle D_Params and D_HEAL
     * * if NOT has_FOREIGN  &&
     * * if NO  D exists in field_data
     * * then no need to handle both
     */
    useEffect(() => {
        if (!selected_D_to_show) return;

        // const selected_D_values = selected_D[fieldname];
        const checked_CD_values = use_M_Store.getState().checked_CD[fieldname];

        // to show <D_Params /> it depends on selected_D and checkbox FOREIGN
        const has_FOREIGN =
            Array.isArray(checked_CD_values) &&
            checked_CD_values.includes("FOREIGN");

        if (has_FOREIGN) return;

        let d_params = [];
        let is_wrong_d_params_in_backend = false;
        const is_this_field_new = fieldname === NEW_added_fieldname;
        // user clicked ADD FIELD
        if (is_this_field_new) {
            console.log(
                "!!!!!!!!!!!!!! Dropdown_D , useEffect -- selected_D_to_show = ",
                selected_D_to_show,
            );
            console.log(
                "!!!!!!!!!!!!!! Dropdown_D , useEffect -- fieldname = ",
                fieldname,
            );
            d_params = find_D_Params_in_M_value(selected_D_to_show, fieldname);
        } else {
            d_params = find_D_Params_in_GLOBAL_METADATA(
                selected_D_to_show,
                fieldname,
            );
        }

        if (!d_params) {
            is_wrong_d_params_in_backend = true;
            d_params = find_NEW_D_Params_in_M_MAP(selected_D_to_show);
        }

        if (!has_FOREIGN && d_params) {
            set_D_Params_State(
                fieldname,
                <D_Params D_NAME={selected_D_to_show} d_params={d_params} />,
            );
        } else {
            set_D_Params_State({});
        }

        // ADD D_Params to d:: if exists , fix the wrong d:: Config
        if (is_wrong_d_params_in_backend) {
            D_HEAL(
                fieldname,
                selected_D_to_show,
                M_value,
                d_params,
                M_value_Service,
            );
        }
    }, [selected_D, NEW_added_fieldname, fieldname]);

    /**
     * * set_selected_D
     * * prepare_new_M_value_for_Update_D
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_D_Actions(event) {
        const new_selected_D = event.target.value;
        //user must not select empty D
        if (new_selected_D === "") {
            alert("click FOREIGN to unselect D");
            return;
        }

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

    const D_Params_State_for_field = use_M_Store((state) =>
        state.D_Params_State ? state.D_Params_State[fieldname] : null,
    );
    return (
        <>
            <select
                className="M_field-dropdown"
                value={selected_D_to_show}
                // key={selected_D_of_field_data} // no need if react does not warn

                disabled={
                    // !activeField ||
                    use_M_Store
                        .getState()
                        .checked_CD[fieldname]?.includes("FOREIGN")
                }
                onChange={(event) => {
                    set_D_Actions(event);
                }}
            >
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    field_data={field_data}
                />
            </select>
            {has_d_in_field_data(field_data) && D_Params_State_for_field}
        </>
    );
}
