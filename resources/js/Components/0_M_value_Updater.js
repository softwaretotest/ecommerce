// 0_M_value_Updater.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import {
    FIELD_PARAMS_MAP,
    DEFAULT_VALUES_MAP,
} from "@/Components/0_field_params_map";

export function prepare_new_M_value_for_Update(
    old_M_value,
    fieldname,
    checked_CD_States,
) {
    // console.log(
    //     "0. GLOBAL_METADATA.app_data.f.IMAGE[1] :",
    //     GLOBAL_METADATA.app_data.f.IMAGE[1],
    // );
    // console.log("---------------------------------");

    // console.log("--- [DEBUG: prepare_new_M_value] ---");
    // console.log("1. Incoming fieldname:", fieldname);
    // console.log("2. Incoming checked_CD_States:", checked_CD_States);
    // console.log("3. Incoming old_M_value:", old_M_value);

    /**
     * * clone of M_value
     * * M_value = m_data or app_data or entities
     * * , when clicked on Main Tab APP_DATA, M_DATA, ENTITIES
     */
    const new_M_value = { ...old_M_value };
    // console.log("4. Cloned new_M_value:", new_M_value);

    /**
     * fieldname_UPPERCASE = PRICE , STOCK
     */
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );
    console.log("4.1 fieldname_UPPERCASE = ", fieldname_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * ['stock' , ['d::DECIMAL' , 10 , 10] , 'u::NUMBER', ['cd::DEFAULT', 0] , 'cud::REQUIRED']
     */
    const field_data = Array.isArray(new_M_value[fieldname_UPPERCASE])
        ? [...new_M_value[fieldname_UPPERCASE]]
        : [];
    console.log("5. Extracted field_data (before clean):", field_data);

    /**
     * * Filter out all existing cd:: and cud:: values
     * * ['stock' , ['d::DECIMAL', 10 , 10] , 'u::NUMBER']
     */
    const field_data_without_cd_cud = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isCD =
            typeof targetString === "string" && targetString.startsWith("cd::");
        const isCUD =
            typeof targetString === "string" &&
            targetString.startsWith("cud::");

        return !isCD && !isCUD;
    });
    console.log(
        "6. field_data_without_cd_cud (after filtering cd::):",
        field_data_without_cd_cud,
    );

    /**
     * cud_names = ['REQUIRED']
     */
    const cud_names = Object.keys(GLOBAL_METADATA.m_data.cud || {});
    // console.log("6.1. cud_names = ", cud_names);

    /**
     * * make new cd , cud to add to new_M_value
     * * [['cd::DEFAULT', 0], 'cud::REQUIRED']
     */
    const checked_cd_cud_names = checked_CD_States.map((item) => {
        const isCud = cud_names.some(
            (key) => key.toLowerCase() === item.toLowerCase(),
        );

        if (item.toUpperCase() === "DEFAULT") {
            // ใช้ fieldname_UPPERCASE แทน fieldname เพื่อความชัวร์ในการเข้าถึง metadata
            const D_name = DEFAULT_VALUES_for_D_CD(fieldname_UPPERCASE);
            // console.log(
            //     "   0_M_value_Updater - prepare_new_M_value_for_Update - D_name = ",
            //     D_name,
            // );
            const prefix = isCud ? "cud" : "cd";
            return [`${prefix}::${item}`, D_name];
        }

        // กรณีปกติ: จัดการ Parameter อื่นๆ
        /**
         * * allways
         * * config = undefined
         * * I want to know , why AI Gemini add this variable config for what ???
         */
        const config = FIELD_PARAMS_MAP[item.toUpperCase()];
        // console.log("6.2 config = ", config);

        if (config) {
            const prefix = isCud ? "cud" : "cd";
            const defaults = config.map((p) => p.default);
            return [`${prefix}::${item}`, ...defaults];
        }

        return isCud ? `cud::${item}` : `cd::${item}`;
    });
    // console.log("7. checked_cd_cud_names (new items):", checked_cd_cud_names);

    new_M_value[fieldname_UPPERCASE] = [
        ...field_data_without_cd_cud,
        ...checked_cd_cud_names,
    ];
    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * ['price', Array(3), 'u::NUMBER', 's::CURRENCY', Array(2), 'cud::REQUIRED']
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    // console.log(
    //     "8. Final new_M_value[fieldname]:",
    //     new_M_value[fieldname_UPPERCASE],
    // );
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
export function DEFAULT_VALUES_for_D_CD(keyName) {
    const field_data = GLOBAL_METADATA.app_data.f[keyName];

    // default for d::FIELDNAME = ''
    if (!field_data || !field_data[1]) return "";

    // d::FIELDNAME can be string or array
    // if Array , Array[0] = String  always (App Convention)
    // e.g. [ 'stock', [ 'd::DECIMAL', 10, 10 ] ]
    const rawTypeString = Array.isArray(field_data[1])
        ? field_data[1][0]
        : field_data[1];

    // console.log(
    //     "0_M_value_Updateer - DEFAULT_VALUES_for_D_CD - rawTypeString = ",
    //     rawTypeString,
    // );

    /**
     * 'd::DECIMAL' -> 'DECIMAL'
     */
    const d_name_UPPERCASE = rawTypeString.split("::")[1].toUpperCase();

    // console.log(
    //     "0_M_value_Updateer - DEFAULT_VALUES_for_D_CD - d_name_UPPERCASE = ",
    //     d_name_UPPERCASE,
    // );

    // get from DEFAULT_VALUES_MAP matched d_name_UPPERCASE
    return DEFAULT_VALUES_MAP[d_name_UPPERCASE] ?? "";
}
