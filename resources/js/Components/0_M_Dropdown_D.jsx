// resources/js/Components/0_M_Dropdown_D.jsx

import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { use_M_Option } from "@/Hooks/use_M_Option";
import { M_value_Service } from "../Services/0_M_value_Service";

import { D_Params } from "@/Components/0_M_D_Params";
import { D_PARAMS_MAP } from "@/Components/0_M_MAP";
import { prepare_new_M_value_for_Update_D } from "@/Components/0_M_value_Updater_D";
import { D_HEAL } from "@/Components/0_M_Dropdown_D_HEAL";
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
 * * d_params = e.g. [ 10, 2 ] for DECIMAL [ total_digit , scale ]
 * *
 */
export function renderDropdown_D(
    M_Class_Name_List,
    fieldDataList = [],
    field_data,
) {
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
    let d_params = [];
    /**
     * * foundValue = e.g. d::INTEGER , u::TEXT , [d:DECIMAL,10,2]
     * */
    if (foundValue) {
        if (Array.isArray(foundValue)) {
            const [stringValue, ...params] = foundValue;
            defaultValue = stringValue.split("::")[1];
            d_params = params;
        }
        //case string e.g. u:: and  d::
        if (
            typeof foundValue === "string" ||
            foundValue.includes("u::") ||
            foundValue.includes("d::")
        ) {
            defaultValue = foundValue.split("::")[1];
            d_params = [];
        }
    }
    // console.log(
    //     ")=)=)=)=)=)=) Dropdown fieldname =",
    //     fieldname.padEnd(13),
    //     "\t d_params =",
    //     d_params,
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
     * prepare d_params for React.Component <D_Params />
     * @param {*} D_Name_UPPERCASE
     * @returns d_params = e.g. [10 , 2] for [DECIMAL,10,2]
     */
    function find_NEW_D_Params_in_M_MAP(D_Name_UPPERCASE) {
        const definition = D_PARAMS_MAP[D_Name_UPPERCASE];
        let d_params = definition?.map((param) => param.default);
        return d_params;
    }

    function find_D_Params_in_GLOBAL_METADATA(D_Name_UPPERCASE) {
        const field_data = GLOBAL_METADATA.app_data.f[fieldname.toUpperCase()];

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
        let d_params = find_D_Params_in_GLOBAL_METADATA(selected_D);
        let is_wrong_d_params_in_backend = false;
        if (!d_params) {
            is_wrong_d_params_in_backend = true;
            d_params = find_NEW_D_Params_in_M_MAP(selected_D);
        }

        setD_Params_State(<D_Params D_NAME={selected_D} d_params={d_params} />);
        if (is_wrong_d_params_in_backend) {
            D_HEAL(
                fieldname,
                selected_D,
                M_value,
                set_M_value,
                d_params,
                M_value_Service,
            );
        }
    }, [selected_D]);

    function prepare_new_M_value_for_Update_D(
        event,
        D_NAME,
        activeField,
        old_M_value,
        set_M_value,
    ) {
        const D_Array = get_D_Array(
            event,
            activeField,
            old_M_value,
            set_M_value,
        );

        const new_M_value = { ...old_M_value };

        // logic to find d:: in old_M_value and replace by D_Array
        const fieldname_UPPERCASE = Object.keys(new_M_value).find(
            (key) => key.toLowerCase() === activeField.toLowerCase(),
        );
        // console.log(" 1. fieldname_UPPERCASE = ", fieldname_UPPERCASE);

        const d_Class_UPPERCASE = `d::${D_NAME}`;
        // console.log(" 2. d_Class_UPPERCASE = ", d_Class_UPPERCASE);

        /**
         * * field_data = we use this name exactly case-sensitive in whole app
         * * e.g.
         * * ['image', 'u::FILE', ['d::DECIMAL', 10, 2]]
         */
        const field_data = [...new_M_value[fieldname_UPPERCASE]];
        // console.log(" 3. Extracted field_data (before clean):", field_data);

        /**
         * * Filter out all existing d:: , cd:: , cud::
         * * ['image', 'd::STRING', 'u::FILE', null, null]
         */
        const field_data_without_d_with_null = field_data.filter((item) => {
            // if Array the first item[0] is always String (App Convention)
            const targetString = Array.isArray(item) ? item[0] : item;

            const isD = targetString.startsWith("d::");

            // remove d cd cud (return false)
            return !isD;
        });

        /**
         * * Filter out null items
         * * ['image', 'd::STRING', 'u::FILE']
         */
        const field_data_without_d = field_data_without_d_with_null.filter(
            (item) => item != null,
        );
        // console.log(" 4. field_data_without_d :", field_data_without_d);

        new_M_value[fieldname_UPPERCASE] = [...field_data_without_d, D_Array];
        // console.log(" 5. new_M_value :", new_M_value);

        /**
         * * new_field_data = data in the focused field after update cd and cud
         * * e.g.
         * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
         */
        const new_field_data = new_M_value[fieldname_UPPERCASE];
        // console.log(" 6. Final new_field_data:", new_field_data);
        // console.log(" 7. Full final new_M_value:", new_M_value);
        // console.log("--- [DEBUG: END] ---");

        return new_M_value;
    }

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

/**
 * 1. get fieldname from M_value
 * 2. find d_Class e.g. d::DECIMAL
 * 3. get d_params from UI Input
 * 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
 *
 * @param {*} activeField = e.g. IMAGE , NAME , PRICE , STOCK
 * @param {*} M_value
 * @returns D_Array e.g. ['d::DECIMAL', 10, 2] or ['d::STRING', 255]
 */
function get_D_Array(event, activeField, M_value, set_M_value) {
    // console.log("get_D_Array 1. fieldname event = ", event);
    // console.log("get_D_Array 1. fieldname activeField = ", activeField);
    // console.log("get_D_Array 1. fieldname M_value = ", M_value);

    // 1. get fieldname from M_value
    const fieldname = Object.keys(M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    // console.log("get_D_Array 2. fieldname = ", fieldname);

    const field_data = M_value[fieldname];
    if (!field_data) return;
    // console.log("get_D_Array 3. field_data = ", field_data);

    /**
     * *  find d_Class_UPPERCASE_Array
     * *  self healing of wrong d_Class_UPPERCASE_Array
     * 2. find d_Class e.g. ['d::DECIMAL',10,2]
     * * if wrong 'd::DECIMAL'
     * * then make it right ['d::DECIMAL',10,2]
     * * save_M_value_Data_for_self_healing_d_Class
     */
    const d_Class_UPPERCASE_Array = (() => {
        /**
         * e.g. ['d::STRING',255]
         */
        const d_Class_Item = field_data.find((item) => {
            const target = Array.isArray(item) ? item[0] : item;
            return typeof target === "string" && target.startsWith("d::");
        });
        if (Array.isArray(d_Class_Item)) return d_Class_Item;

        // d_Class_Item is a string
        const d_Name_UPPERCASE = d_Class_Item.replace("d::", "");

        const config = D_PARAMS_MAP[d_Name_UPPERCASE];

        // if not in config, then d_Class_Item meant to be string
        if (!config) return d_Class_Item; //e.g. 'd::BOOLEAN' , 'd::INTEGER'

        const d_Array = [
            // if 'd::STRING' = wrong , must be Array made by D_PARAMS_MAP
            `d::${d_Name_UPPERCASE}`,
            ...D_PARAMS_MAP[d_Name_UPPERCASE].map((p) => p.default),
        ]; // return e.g. ['d::STRING',255]

        return d_Array;
    })();

    // console.log(
    //     "get_D_Array 4. d_Class_UPPERCASE_Array = ",
    //     d_Class_UPPERCASE_Array,
    // );
    // console.log(
    //     "get_D_Array 5. d_Class_UPPERCASE_Array[0] = ",
    //     d_Class_UPPERCASE_Array[0],
    // );

    if (!d_Class_UPPERCASE_Array) return;

    // 3. get d_params from UI Input
    const container = event.target.closest(".d_params_container");

    if (!container) {
        console.error(`NOT FOUND container of field : ${activeField}`);
        return;
    }
    // console.log("get_D_Array 6. container = ", container);
    const inputs = container.querySelectorAll(".d_param_input");
    const params_values = Array.from(inputs).map((input) =>
        Number(input.value),
    );

    // 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
    // d_Class_UPPERCASE_Array[0], because only 1 d:: per field (M_Convention)
    const D_Array = [`${d_Class_UPPERCASE_Array[0]}`, ...params_values];
    // console.log("get_D_Array 7. D_Array = ", D_Array);
    // console.log("get_D_Array --- [DEBUG: END] ---");

    return D_Array;
}
