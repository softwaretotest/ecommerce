// resources/js/Components/0_M_value_Updater_U.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { D_PARAMS_MAP, DEFAULT_VALUES_MAP } from "@/Components/0_M_MAP";

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove cu::, cuu::)
 * 3. Construct New Metadata (Apply MAP defaults)
 * 4. Re-assemble
 *
 * @example in M_value
 * // Before: 'u::INTEGER'
 * // Input : U_NAME = 'TEXT'
 * // After : ['price', ['u::TEXT', 255], ['cu::DEFAULT', ""]]
 *
 * @param fieldname e.g. image , stock , price , name
 * @param U_NAME = e.g. TEXT , INTEGER , DECIMAL
 */
export function prepare_new_M_value_for_Update_U(
    U_NAME,
    activeField,
    old_M_value,
) {
    const debug = false;
    if (debug)
        console.log(
            " UUUU-Class  0. - prepare_new_M_value_for_Update_D - U_NAME = ",
            U_NAME,
        );
    if (debug)
        console.log(
            " UUUU-Class  0. - prepare_new_M_value_for_Update_D - activeField = ",
            activeField,
        );
    if (debug)
        console.log(
            " UUUU-Class  0. - prepare_new_M_value_for_Update_D - old_M_value = ",
            old_M_value,
        );

    const new_M_value = { ...old_M_value };

    // logic to find u:: in old_M_value and replace by D_Array
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    if (debug)
        console.log(
            " UUUU-Class  1. fieldname_UPPERCASE = ",
            fieldname_UPPERCASE,
        );

    const d_Class_UPPERCASE = `u::${U_NAME}`;
    if (debug)
        console.log(" UUUU-Class  2. d_Class_UPPERCASE = ", d_Class_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * e.g.
     * * ['image', 'u::FILE', ['u::DECIMAL', 10, 2]]
     */
    const field_data = [...new_M_value[fieldname_UPPERCASE]];
    if (debug)
        console.log(
            " UUUU-Class  3. Extracted field_data (before clean):",
            field_data,
        );

    /**
     * * Filter out all existing u::
     * * ['image', 'u::TEXT', 'u::FILE', null, null]
     */
    const field_data_without_u_with_null = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isD = targetString.startsWith("u::");

        // remove d cd cud (return false)
        return !isD;
    });

    const U_String = get_U_String();
    // if(debug)console.log(" UUUU-Class 4.0 U_String() (new items):", U_String);

    /**
     * * Filter out null items
     * * ['image', 'u::TEXT', 'u::FILE']
     */
    const field_data_without_u = field_data_without_u_with_null.filter(
        (item) => item != null,
    );
    if (debug)
        console.log(
            " UUUU-Class  4.1 field_data_without_u :",
            field_data_without_u,
        );

    new_M_value[fieldname_UPPERCASE] = [...field_data_without_u, U_String];
    if (debug) console.log(" UUUU-Class  5. new_M_value :", new_M_value);

    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * e.g.
     * * ['price', ['u::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cu::DEFAULT',0]]
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    if (debug)
        console.log(" UUUU-Class  6. Final new_field_data:", new_field_data);
    if (debug)
        console.log(" UUUU-Class  7. Full final new_M_value:", new_M_value);
    if (debug) console.log(" UUUU-Class --- [DEBUG: END] ---");

    return new_M_value;
}
