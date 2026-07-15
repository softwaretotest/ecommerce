// resources/js/Components/0_M_value_Updater_CD.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { D_PARAMS_MAP, DEFAULT_VALUES_MAP } from "@/Components/0_M_MAP";

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove cd::, cud::)
 * 3. Construct New Metadata (Apply MAP defaults)
 * 4. Re-assemble
 *
 * @example in M_value
 * // Before: 'd::INTEGER'
 * // Input : D_NAME = 'STRING'
 * // After : ['price', ['d::STRING', 255], ['cd::DEFAULT', ""]]
 *
 * @param fieldname e.g. image , stock , price , name
 * @param D_NAME = e.g. STRING , INTEGER , DECIMAL
 */
export function prepare_new_M_value_for_Update_D(
    D_NAME,
    activeField,
    old_M_value,
) {
    const debug = true;
    if (debug)
        console.log(
            " DDDD-Class  0. - prepare_new_M_value_for_Update_D - D_NAME = ",
            D_NAME,
        );
    if (debug)
        console.log(
            " DDDD-Class  0. - prepare_new_M_value_for_Update_D - activeField = ",
            activeField,
        );
    if (debug)
        console.log(
            " DDDD-Class  0. - prepare_new_M_value_for_Update_D - old_M_value = ",
            old_M_value,
        );

    const new_M_value = { ...old_M_value };

    // logic to find d:: in old_M_value and replace by D_Array
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    if (debug)
        console.log(
            " DDDD-Class  1. fieldname_UPPERCASE = ",
            fieldname_UPPERCASE,
        );

    const d_Class_UPPERCASE = `d::${D_NAME}`;
    if (debug)
        console.log(" DDDD-Class  2. d_Class_UPPERCASE = ", d_Class_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * e.g.
     * * ['image', 'u::FILE', ['d::DECIMAL', 10, 2]]
     */
    const field_data = [...new_M_value[fieldname_UPPERCASE]];
    if (debug)
        console.log(
            " DDDD-Class  3. Extracted field_data (before clean):",
            field_data,
        );

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
     * * with default values from D_PARAMS_MAP
     * * make new d to add to new_M_value , e.g.
     * * ['d::STRING', 255]
     * * ['d::DECIMAL',10,2]
     * *  'd::BOOLEAN'
     */
    function get_D_Array_or_String() {
        const params = D_PARAMS_MAP[D_NAME];
        // if(debug)console.log(" DDDD-Class 6.2. params = ", params);

        const d_Class_UPPERCASE = `d::${D_NAME}`;

        if (params) {
            const values = params.map((p) => p.default);
            return [d_Class_UPPERCASE, ...values]; //d_Array
        }

        return d_Class_UPPERCASE; // d_String
    }

    const D_Array_or_String = get_D_Array_or_String();
    // if(debug)console.log(" DDDD-Class 4.0 D_Array_or_String() (new items):", D_Array_or_String);

    /**
     * * Filter out null items
     * * ['image', 'd::STRING', 'u::FILE']
     */
    const field_data_without_d = field_data_without_d_with_null.filter(
        (item) => item != null,
    );
    if (debug)
        console.log(
            " DDDD-Class  4.1 field_data_without_d :",
            field_data_without_d,
        );

    /**
     * * if default_checked , then reset CD::DEFAULT
     * * that means ,
     * * if found CD::DEFAULT , then get DEFAULT_VALUES for D_NAME
     */
    const new_field_data_DEFAULT_HEAL = field_data_without_d.map((item) => {
        if (Array.isArray(item) && item[0] === "cd::DEFAULT") {
            const new_default = DEFAULT_VALUES_MAP[D_NAME]; // ดึงค่าเริ่มต้นใหม่ตาม Type
            return ["cd::DEFAULT", new_default];
        }
        return item;
    });

    new_M_value[fieldname_UPPERCASE] = [
        ...new_field_data_DEFAULT_HEAL,
        D_Array_or_String,
    ];
    if (debug) console.log(" DDDD-Class  5. new_M_value :", new_M_value);

    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * e.g.
     * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    if (debug)
        console.log(" DDDD-Class  6. Final new_field_data:", new_field_data);
    if (debug)
        console.log(" DDDD-Class  7. Full final new_M_value:", new_M_value);
    if (debug) console.log(" DDDD-Class --- [DEBUG: END] ---");

    return new_M_value;
}
