// resources/js/Components/0_M_D_Params.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";

import { D_PARAMS_MAP } from "@/Components/0_M_MAP";

import JSON_Content from "./0_M_JSON_Content";

export function D_Params({ D_NAME, D_params }) {
    if (!D_params) return;

    const { set_M_value, activeField, setActiveField, setJSON_Content_State } =
        use_M_Store();

    const M_value = use_M_Store.getState().M_value;
    const config = D_PARAMS_MAP[D_NAME];

    return (
        <div className="d_params_container" data-field={activeField}>
            <p className="field_param_header">{D_NAME} params</p>
            {config?.map((item, index) => (
                /**
                 * * we must set key={index + D_NAME} to make uiniq DOM
                 * * otherwise we have problem when user switch Dropdown D like this e.g.
                 * * between [DECIMAL,10,2] and [STRING,255]
                 * *  switch the 10 <----> 255   ,
                 * *DECIMAL item[0] <----> item[0] STRING
                 **/
                <div key={index + D_NAME} className="d_param_body">
                    <label className="d_param_label">{item.label}:</label>
                    <input
                        type="number"
                        defaultValue={D_params[index]}
                        className="d_param_input"
                        onChange={(event) => {
                            save_M_value_Data(
                                event,
                                D_NAME,
                                M_value,
                                set_M_value,
                                activeField,
                                setActiveField,
                                setJSON_Content_State,
                            );
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

async function save_M_value_Data(
    event,
    D_NAME,
    M_value,
    set_M_value,
    activeField,
    setActiveField,
    setJSON_Content_State,
) {
    // prepare new data
    const new_M_value = prepare_new_M_value_for_Update_D(
        event,
        D_NAME,
        activeField,
        M_value,
    );
    // update M_Store
    set_M_value(new_M_value);

    // update JSON files on Backend
    await M_value_Service.update(new_M_value);

    // update JSON View
    setJSON_Content_State(<JSON_Content M_value={new_M_value} />);
}

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove d:: , cd:: , cud::)
 * 3. Construct New Metadata ( Apply d:: new D_params )
 * 4. Re-assemble
 *
 * @example in M_value
 * // Before: ['d::DECIMAL', 10 , 2 ]  = ['d::DECIMAL', Total digits , scale ]
 * // Input : Total digits = 5
 * // After : ['d::DECIMAL', 5 , 2 ]
 *
 * @param activeField = fieldname_UPPERCASE from setFocus() e.g. STOCK , PRICE , NAME
 * @param D_NAME = e.g. STRING , DECIMAL
 */
function prepare_new_M_value_for_Update_D(
    event,
    D_NAME,
    activeField,
    old_M_value,
) {
    console.log("&&&&&&&&&&&&&&&&& activeField = ", activeField);
    const D_Array = get_D_Array(event, activeField, old_M_value);
    console.log(" 0. D_Array = ", D_Array);

    const new_M_value = { ...old_M_value };

    // logic to find d:: in old_M_value and replace by D_Array
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    console.log(" 1. fieldname_UPPERCASE = ", fieldname_UPPERCASE);

    const d_Class_UPPERCASE = `d::${D_NAME}`;
    console.log(" 2. d_Class_UPPERCASE = ", d_Class_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * e.g.
     * * ['image', 'u::FILE', ['d::DECIMAL', 10, 2]]
     */
    const field_data = [...new_M_value[fieldname_UPPERCASE]];
    console.log(" 3. Extracted field_data (before clean):", field_data);

    /**
     * * Filter out all existing d:: , cd:: , cud::
     * * ['image', 'd::STRING', 'u::FILE', null, null]
     */
    const field_data_without_d_with_null = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isD = targetString.startsWith("d::");

        // remove d cd cud (return false)
        return !isD && !isCD && !isCUD;
    });

    /**
     * * Filter out null items
     * * ['image', 'd::STRING', 'u::FILE']
     */
    const field_data_without_d = field_data_without_d_with_null.filter(
        (item) => item != null,
    );
    console.log(" 4. field_data_without_d :", field_data_without_d);

    new_M_value[fieldname_UPPERCASE] = [...field_data_without_d, D_Array];
    console.log(" 5. new_M_value :", new_M_value);

    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * e.g.
     * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    console.log(" 6. Final new_field_data:", new_field_data);
    console.log(" 7. Full final new_M_value:", new_M_value);
    console.log("--- [DEBUG: END] ---");

    return new_M_value;
}

/**
 * 1. get fieldname from M_value
 * 2. find d_Class e.g. d::DECIMAL
 * 3. get D_params from UI Input
 * 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
 *
 * @param {*} activeField = e.g. IMAGE , NAME , PRICE , STOCK
 * @param {*} M_value
 * @returns D_Array e.g. ['d::DECIMAL', 10, 2] or ['d::STRING', 255]
 */
function get_D_Array(event, activeField, M_value) {
    console.log("get_D_Array ???????????? fieldname event = ", event);
    console.log(
        "get_D_Array ???????????? fieldname activeField = ",
        activeField,
    );
    console.log("get_D_Array ???????????? fieldname M_value = ", M_value);

    // 1. get fieldname from M_value
    const fieldname = Object.keys(M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    console.log("???????????? fieldname = ", fieldname);

    const field_data = M_value[fieldname];
    if (!field_data) return;
    console.log("get_D_Array ???????????? field_data = ", field_data);

    /**
     * 2. find d_Class e.g. ['d::DECIMAL',10,2]
     * * if wrong 'd::DECIMAL'
     * * then make it right ['d::DECIMAL',10,2]
     */
    const d_Class_UPPERCASE_Array = (() => {
        /**
         * e.g. ['d::STRING',255]
         */
        const d_Class_Item = field_data[1];
        if (Array.isArray(d_Class_Item)) return d_Class_Item;

        // d_Class_Item is a string
        const d_Name_UPPERCASE = d_Class_Item.replace("d::", "");

        const config = D_PARAMS_MAP[d_Name_UPPERCASE];

        // if not in config, then d_Class_Item meant to be string
        if (!config) return d_Class_Item; //e.g. 'd::BOOLEAN' , 'd::INTEGER'

        const d_Class = [
            // if 'd::STRING' = wrong , must be Array made by D_PARAMS_MAP
            `d::${d_Name_UPPERCASE}`,
            ...D_PARAMS_MAP[d_Name_UPPERCASE].map((p) => p.default),
        ]; // return e.g. ['d::STRING',255]

        return d_Class;
    })();

    console.log(
        "get_D_Array ???????????? d_Class_UPPERCASE_Array = ",
        d_Class_UPPERCASE_Array,
    );
    console.log(
        "get_D_Array ???????????? d_Class_UPPERCASE_Array[0] = ",
        d_Class_UPPERCASE_Array[0],
    );

    if (!d_Class_UPPERCASE_Array) return;

    // 3. get D_params from UI Input
    const container = event.target.closest(".d_params_container");

    if (!container) {
        console.error(`NOT FOUND container of field : ${activeField}`);
        return;
    }
    console.log("get_D_Array ???????????? container = ", container);
    const inputs = container.querySelectorAll(".d_param_input");
    const params_values = Array.from(inputs).map((input) =>
        Number(input.value),
    );

    // 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
    // d_Class_UPPERCASE_Array[0], because only 1 d:: per field (M_Convention)
    const D_Array = [`${d_Class_UPPERCASE_Array[0]}`, ...params_values];

    return D_Array;
}
