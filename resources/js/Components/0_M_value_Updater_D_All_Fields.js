// resources/js/Components/0_M_value_Updater_D_All_Fields.js
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
 * @param D_NAME = e.g. STRING , INTEGER , DECIMAL
 * @param D_HEAL_collected = e.g.
 * * { image: Array(2), name: Array(2), order_nr: Array(2) }
 * *   image: ['d::STRING', 255]
 * *    name: ['d::STRING', 255]
 * *order_nr: ['d::STRING', 255]
 */
export function prepare_new_M_value_for_Update_D_All_Fields(
    D_HEAL_collected,
    old_M_value,
) {
    const debug = true;
    if (debug)
        console.log(
            "DDDD-Class 0. - prepare_new_M_value_for_Update_D_All_Fields - D_HEAL_collected = ",
            D_HEAL_collected,
        );
    if (debug)
        console.log(
            "DDDD-Class 0. - prepare_new_M_value_for_Update_D_All_Fields - old_M_value = ",
            old_M_value,
        );

    const new_M_value = { ...old_M_value };

    if (debug)
        console.log(
            "DDDD-Class 0. - prepare_new_M_value_for_Update_D_All_Fields - new_M_value = ",
            new_M_value,
        );

    for (const [key, value] of Object.entries(D_HEAL_collected)) {
        if (debug)
            console.log(
                "DDDD-Class 1. - prepare_new_M_value_for_Update_D_All_Fields - D_HEAL_collected : key = ",
                key.padEnd(8),
                "value = ",
                value,
            );
        const fieldname_UPPERCASE = key.toUpperCase();
        if (debug)
            console.log(
                "DDDD-Class 2. - fieldname_UPPERCASE = ",
                fieldname_UPPERCASE,
            );

        /**
         * * field_data = we use this name exactly case-sensitive in whole app
         * * e.g.
         * * ['image', 'u::FILE', ['d::DECIMAL', 10, 2]]
         */
        const field_data = [...new_M_value[fieldname_UPPERCASE]];
        if (debug)
            console.log(
                "DDDD-Class 3. - Extracted field_data (before clean):",
                field_data,
            );

        /**
         * * Filter out all existing d::
         * * ['image', 'd::STRING', 'u::FILE', null, null]
         */
        const field_data_without_d_with_null = field_data.filter((item) => {
            // if Array the first item[0] is always String (App Convention)
            const targetString = Array.isArray(item) ? item[0] : item;

            const isD = targetString.startsWith("d::");

            // remove d cd cud (return false)
            return !isD;
        });

        const D_Array = value;
        if (debug) console.log("DDDD-Class 4. - D_Array = ", D_Array);

        /**
         * * Filter out null items
         * * ['image', 'd::STRING', 'u::FILE']
         */
        const field_data_without_d = field_data_without_d_with_null.filter(
            (item) => item != null,
        );
        if (debug)
            console.log(
                "DDDD-Class 5. - field_data_without_d :",
                field_data_without_d,
            );

        new_M_value[fieldname_UPPERCASE] = [...field_data_without_d, D_Array];

        /**
         * * new_field_data = data in the focused field after update cd and cud
         * * e.g.
         * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
         */
        if (debug)
            console.log(
                "DDDD-Class 6. new_M_value[fieldname_UPPERCASE]:",
                new_M_value[fieldname_UPPERCASE],
            );
    }

    if (debug)
        console.log("DDDD-Class 8. - Full final new_M_value:", new_M_value);
    if (debug) console.log("DDDD-Class --- [DEBUG: END] ---");

    return new_M_value;
}
