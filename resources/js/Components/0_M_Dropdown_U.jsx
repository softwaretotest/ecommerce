// resources/js/Components/0_M_Dropdown_U.jsx

import { use_M_Option } from "@/Hooks/use_M_Option";

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
function M_Option_U({ M_Class_Name_List, fieldDataList = [] }) {
    console.log(
        "APP_DATA tab - Dropdown_U  option UUUUU  M_Class_Name_List = ",
        M_Class_Name_List,
    );
    const { getOptions } = use_M_Option();
    if (!M_Class_Name_List) return null;
    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name);

        return options.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));
    });
}

import { useState, useEffect } from "react";
import { M_value_Service } from "../Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";

import { D_Params } from "@/Components/0_M_D_Params";
import { D_PARAMS_MAP } from "@/Components/0_M_MAP";
import { prepare_new_M_value_for_Update_D } from "@/Components/0_M_value_Updater_D";
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";

import JSON_Content from "@/Components/0_M_JSON_Content";

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
 * * D_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown_U(
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
    const foundValue = fieldDataList.find((item) => {
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
    let D_params = [];
    /**
     * * foundValue = e.g. d::INTEGER , u::TEXT , [d:DECIMAL,10,2]
     * */
    if (foundValue) {
        if (Array.isArray(foundValue)) {
            const [stringValue, ...params] = foundValue;
            defaultValue = stringValue.split("::")[1];
            D_params = params;
        }
        //case string e.g. u:: and  d::
        if (
            typeof foundValue === "string" ||
            foundValue.includes("u::") ||
            foundValue.includes("d::")
        ) {
            defaultValue = foundValue.split("::")[1];
            D_params = [];
        }
    }
    // console.log(
    //     ")=)=)=)=)=)=) Dropdown fieldname =",
    //     fieldname.padEnd(13),
    //     "\t D_params =",
    //     D_params,
    //     "\t\t foundValue =",
    //     foundValue,
    // );
    /**
     * * selected_D: state from dropdown e.g. STRING , DECIMAL , INTEGER
     * * handle_Change: update state when option change
     */
    const [selected_D, set_Selected_D] = useState(defaultValue);

    const [D_Params_State, setD_Params_State] = useState(null);

    /**
     * prepare D_params for React.Component <D_Params />
     * @param {*} D_Name_UPPERCASE
     * @returns D_params = e.g. [10 , 2] for [DECIMAL,10,2]
     */
    function find_NEW_D_Params_in_M_MAP(D_Name_UPPERCASE) {
        const definition = D_PARAMS_MAP[D_Name_UPPERCASE];
        let D_params = definition?.map((param) => param.default);
        return D_params;
    }

    function find_D_Params_in_GLOBAL_METADATA(D_Name_UPPERCASE) {
        const key = fieldname.toUpperCase();
        // find in both classes app_data.f and m_data.s
        const field_data =
            GLOBAL_METADATA?.app_data?.f?.[key] ||
            GLOBAL_METADATA?.m_data?.s?.[key];

        // field_data if not found return null (avoid error)
        if (!field_data || !Array.isArray(field_data)) {
            console.warn(`[DEBUG] No field_data found for key: ${key}`);
            return null;
        }
        /**
         * @return  e.g. ['d::DECIMAL', 10, 10] or 'd::BOOLEAN'
         */
        const d_Class_Item = field_data.find((item) => {
            const target = Array.isArray(item) ? item[0] : item;
            return typeof target === "string" && target.startsWith("d::");
        });

        if (!Array.isArray(d_Class_Item)) return; // if wrong config e.g. d::STRING

        const d_Name = d_Class_Item[0].replace("d::", "");

        /**
         * * cut out d:: to send only params , e.g.
         * * before [ 'd::DECIMAL', 10 , 2 ]
         * * after  [ 10 , 2 ]
         */
        if (d_Name === D_Name_UPPERCASE) return d_Class_Item.slice(1);
        else return null;
    }

    useEffect(() => {
        if (!selected_D) return;
        let D_params = find_D_Params_in_GLOBAL_METADATA(selected_D);
        if (!D_params) D_params = find_NEW_D_Params_in_M_MAP(selected_D);
        setD_Params_State(<D_Params D_NAME={selected_D} D_params={D_params} />);
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
                <M_Option_U
                    M_Class_Name_List={M_Class_Name_List}
                    fieldDataList={fieldDataList}
                />
            </select>
            {D_Params_State}
        </>
    );
}
