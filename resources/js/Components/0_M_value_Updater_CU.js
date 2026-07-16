// resources/js/Components/0_M_value_Updater_CD.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove cu::, cud::)
 * 3. Construct New Metadata (Apply D_PARAMS_MAP.default)
 * 4. Re-assemble
 *
 * @example
 * // Before: ['price', ['d::DECIMAL', 10, 2], 'cu::REQUIRED']
 * // Input : checked_CU_States = ['READONLY']
 * // After : ['price', ['d::DECIMAL', 10, 2], 'cu::REQUIRED' , 'cu::READONLY']
 *
 * @param fieldname e.g. image , stock , price , name
 * @param checked_CU_States e.g. ['REQUIRED', 'READONLY']
 */
export function prepare_new_M_value_for_Update_CU(
    old_M_value,
    fieldname,
    checked_CU_States,
) {
    const debug = true;
    if (debug)
        console.log(
            "0. GLOBAL_METADATA.app_data.f.IMAGE[1] :",
            GLOBAL_METADATA.app_data.f.IMAGE[1],
        );
    if (debug) console.log("---------------------------------");

    if (debug)
        console.log(
            "--- prepare_new_M_value_for_Update_CU - [ DEBUG: START ] ---",
        );
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 1. Incoming fieldname:",
            fieldname,
        );
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 2. Incoming checked_CU_States:",
            checked_CU_States,
        );
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 3. Incoming old_M_value:",
            old_M_value,
        );

    /**
     * * clone of M_value
     * * M_value = m_data or app_data or entities
     * * , when clicked on Main Tab APP_DATA, M_DATA, ENTITIES
     */
    const new_M_value = { ...old_M_value };
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 4. Cloned new_M_value:",
            new_M_value,
        );

    /**
     * fieldname_UPPERCASE = PRICE , STOCK
     */
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 4.1 fieldname_UPPERCASE = ",
            fieldname_UPPERCASE,
        );

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * ['stock' , ['d::DECIMAL' , 10 , 10] , 'u::NUMBER', ['cu::DEFAULT', 0] , 'cud::REQUIRED']
     */
    const field_data = Array.isArray(new_M_value[fieldname_UPPERCASE])
        ? [...new_M_value[fieldname_UPPERCASE]]
        : [];
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 5. Extracted field_data (before clean):",
            field_data,
        );

    /**
     * * Filter out all existing cu:: and cud:: values
     * * ['stock' , ['d::DECIMAL', 10 , 10] , 'u::NUMBER']
     */
    const field_data_without_cu_cud = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isCU =
            typeof targetString === "string" && targetString.startsWith("cu::");
        const isCUD =
            typeof targetString === "string" &&
            targetString.startsWith("cud::");

        return !isCU && !isCUD;
        // return !isCU;
    });
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 6. field_data_without_cu_cud (after filtering cu::):",
            field_data_without_cu_cud,
        );

    /**
     * cud_names = ['REQUIRED']
     */
    const cud_names = Object.keys(GLOBAL_METADATA.m_data.cud || {});
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 6.1. cud_names = ",
            cud_names,
        );

    /**
     * * make new cd , cud to add to new_M_value
     * * [ 'cu::DISABLED' , 'cud::REQUIRED' , 'cu::READONLY' ]
     */
    const checked_cu_cud_names = checked_CU_States.map((name) => {
        if (name === "REQUIRED") {
            return `cud::${name}`;
        }
        return `cu::${name}`;
    });

    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 7. checked_cu_cud_names =",
            checked_cu_cud_names,
        );

    new_M_value[fieldname_UPPERCASE] = [
        ...field_data_without_cu_cud,
        ...checked_cu_cud_names,
    ];
    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * ['price', Array(3), 'u::NUMBER', 's::CURRENCY', Array(2), 'cud::REQUIRED']
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 8. Final new_M_value[fieldname]:",
            new_M_value[fieldname_UPPERCASE],
        );
    if (debug)
        console.log(
            "prepare_new_M_value_for_Update_CU - 9. Full final new_M_value:",
            new_M_value,
        );
    if (debug)
        console.log("--- prepare_new_M_value_for_Update_CU - [DEBUG: END] ---");

    return new_M_value;
}
