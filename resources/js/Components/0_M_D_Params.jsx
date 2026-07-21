// resources/js/Components/0_M_D_Params.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "@/Services/0_M_value_Service";

import { D_PARAMS_MAP } from "@/Components/0_M_MAP";
import { get_D_Array } from "@/Components/0_M_D_Params_Service";

export function D_Params({ D_NAME, d_params }) {
    if (!d_params) return;

    const { activeField } = use_M_Store();

    const M_value = use_M_Store.getState().M_value;
    const set_M_value = use_M_Store.getState().set_M_value;
    const config = D_PARAMS_MAP[D_NAME];

    return (
        <div className="d_params_container" data-field={activeField}>
            <p className="field_param_header">{D_NAME} params</p>
            {config?.map((item, index) => (
                /**
                 * * we must set key={index + D_NAME} to make uiniq DOM
                 * * otherwise we have problem
                 * * when user switch Dropdown D like this e.g.
                 * * between [DECIMAL,10,2] and [STRING,255]
                 * *  switch the 10 <----> 255   ,
                 * *DECIMAL item[0] <----> item[0] STRING
                 **/
                <div key={index + D_NAME} className="d_param_body">
                    <label className="d_param_label">{item.label}:</label>
                    <input
                        type="number"
                        defaultValue={d_params[index]}
                        /**
                         * * readOnly={!activeField}
                         * * prevent activeField = null ,
                         * * user must select a field first
                         * * (= TabContent setActiveField)
                         * * before making any change in UI
                         */
                        readOnly={!activeField}
                        className="d_param_input"
                        onChange={(event) => {
                            save_M_value_Data(
                                event,
                                D_NAME,
                                M_value,
                                set_M_value,
                                activeField,
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
) {
    // prepare new data
    const new_M_value = prepare_new_M_value_for_Update_D(
        event,
        D_NAME,
        activeField,
        M_value,
    );
    await M_value_Service.update(new_M_value);
}

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove d:: , cd:: , cud::)
 * 3. Construct New Metadata ( Apply d:: new d_params )
 * 4. Re-assemble
 *
 * @example in M_value
 * // Before: ['d::DECIMAL', 10 , 2 ]  = ['d::DECIMAL', Total digits , scale ]
 * // Input : Total digits = 5
 * // After : ['d::DECIMAL', 5 , 2 ]
 *
 * @param activeField = fieldname_UPPERCASE from activeField e.g. STOCK , PRICE , NAME
 * @param D_NAME = e.g. STRING , DECIMAL
 */
function prepare_new_M_value_for_Update_D(
    event,
    D_NAME,
    activeField,
    old_M_value,
    set_M_value,
) {
    const D_Array = get_D_Array(event, activeField, old_M_value, set_M_value);

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
