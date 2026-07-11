// 0_M_value_Updater_CD.js
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
 * // Input : selected_D = 'STRING'
 * // After : ['price', ['d::STRING', 255], ['cd::DEFAULT', ""]]
 *
 * @param fieldname e.g. image , stock , price , name
 * @param selected_D = e.g. STRING , INTEGER , DECIMAL
 */
export function prepare_new_M_value_for_Update_D(
    old_M_value,
    fieldname,
    selected_D,
) {
    // console.log("---------------------------------");

    // console.log("--- [DEBUG: prepare_new_M_value] ---");
    // console.log("1. Incoming fieldname:", fieldname);
    // console.log("2. Incoming selected_D:", selected_D);
    // console.log("3. Incoming old_M_value:", old_M_value);

    /**
     * * clone of M_value
     * * M_value = m_data or app_data or entities
     * * , when clicked on Main Tab APP_DATA, M_DATA, ENTITIES
     */
    const new_M_value = { ...old_M_value };
    // console.log("4. Cloned new_M_value:", new_M_value);

    /**
     * fieldname_UPPERCASE = IMAGE, PRICE , STOCK
     */
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );
    // console.log("4.1 fieldname_UPPERCASE = ", fieldname_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * e.g.
     * * ['image', 'd::STRING', 'u::FILE', null, null]
     */
    const field_data = Array.isArray(new_M_value[fieldname_UPPERCASE])
        ? [...new_M_value[fieldname_UPPERCASE]]
        : [];
    // console.log("5. Extracted field_data (before clean):", field_data);

    /**
     * * Filter out all existing d:: , cd:: , cud::
     * * ['image', 'd::STRING', 'u::FILE', null, null]
     */
    const field_data_without_d_cd_cud_with_null = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isD = targetString.startsWith("d::");
        const isCD = targetString.startsWith("cd::");
        const isCUD = targetString.startsWith("cud::");

        // remove d cd cud (return false)
        return !isD && !isCD && !isCUD;
    });

    /**
     * * Filter out null items
     * * ['image', 'd::STRING', 'u::FILE']
     */
    const field_data_without_d_cd_cud =
        field_data_without_d_cd_cud_with_null.filter((item) => item != null);
    // console.log(
    //     "6. field_data_without_d_cd_cud :",
    //     field_data_without_d_cd_cud,
    // );

    /**
     * d_names = ['BOOLEAN', 'INTEGER', 'DECIMAL', 'STRING', 'UNSIGNED_BINT']
     */
    const d_names = Object.keys(GLOBAL_METADATA.m_data.d);
    // console.log("6.1. d_names = ", d_names);

    /**
     * * with default values from D_PARAMS_MAP
     * * make new d to add to new_M_value , e.g.
     * * ['d::STRING', 255]
     * * ['d::DECIMAL',10,2]
     * *  'd::BOOLEAN'
     */
    function get_D_Array_or_String() {
        const params = D_PARAMS_MAP[selected_D];
        // console.log("6.2. params = ", params);

        const d_Class_UPPERCASE = `d::${selected_D}`;

        if (params) {
            const values = params.map((p) => p.default);
            return [d_Class_UPPERCASE, ...values]; //d_Array
        }

        return d_Class_UPPERCASE; // d_String
    }
    const D_Array_or_String = get_D_Array_or_String();
    // console.log("7. D_Array_or_String() (new items):", D_Array_or_String);

    new_M_value[fieldname_UPPERCASE] = [
        ...field_data_without_d_cd_cud,
        D_Array_or_String,
    ];
    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * e.g.
     * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    // console.log("8. Final new_field_data:", new_field_data);
    // console.log("9. Full final new_M_value:", new_M_value);
    // console.log("--- [DEBUG: END] ---");

    return new_M_value;
}

/**
 * * find out the default value for d:: cd:: cud:: with params
 * * if params exists, d:: cd:: cud:: are array
 * * e.g. ['cd::DEFAULT', 0] , ['d::DECIMAL', 10, 10]
 * @param {*} keyName
 * @returns
 */
export function DEFAULT_VALUES_for_D(keyName) {
    const field_data = GLOBAL_METADATA.app_data.f[keyName];

    // default for d::FIELDNAME = ''
    if (!field_data || !field_data[1]) return "";

    /**
     * * d::FIELDNAME can be string or array
     * * if Array , Array[0] = String  always (App Convention)
     * * e.g. [ 'd::DECIMAL', 10, 10 ] of [ 'stock', [ 'd::DECIMAL', 10, 10 ] ]
     * * e.g.   'd::STRING' of [ 'name', 'd::STRING' ]
     */
    const d_Class_UPPERCASE = Array.isArray(field_data[1])
        ? field_data[1][0]
        : field_data[1];
    // console.log(
    //     "0_M_value_Updateer - DEFAULT_VALUES_for_D - d_Class_UPPERCASE = ",
    //     d_Class_UPPERCASE,
    // );

    /**
     * 'DECIMAL' of 'd::DECIMAL' ->
     */
    const d_Name_UPPERCASE = d_Class_UPPERCASE.split("::")[1].toUpperCase();
    // console.log(
    //     "0_M_value_Updateer - DEFAULT_VALUES_for_D - d_Name_UPPERCASE = ",
    //     d_Name_UPPERCASE,
    // );

    // get from DEFAULT_VALUES_MAP matched d_Name_UPPERCASE
    return DEFAULT_VALUES_MAP[d_Name_UPPERCASE] ?? "";
}
