// resources/js/Components/0_M_value_Updater_CD.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { D_PARAMS_MAP, DEFAULT_VALUES_MAP } from "@/Components/0_M_MAP";

/**
 * 1. Clone & Isolate
 * 2. Clean Up (Remove cd::, cud::)
 * 3. Construct New Metadata (Apply MAP defaults)
 * 4. Re-assemble
 *
 * @example
 * // Before: ['price', ['d::DECIMAL', 10, 2], 'cd::REQUIRED']
 * // Input : checked_CD_States = ['DEFAULT']
 * // After : ['price', ['d::DECIMAL', 10, 2], ['cd::DEFAULT', 0]]
 *
 * @param fieldname e.g. image , stock , price , name
 * @param checked_CD_States e.g. ['REQUIRED', 'DEFAULT']
 */
export function prepare_new_M_value_for_Update_CD(
    old_M_value,
    fieldname,
    checked_CD_States,
) {
    console.log(
        "0. GLOBAL_METADATA.app_data.f.IMAGE[1] :",
        GLOBAL_METADATA.app_data.f.IMAGE[1],
    );
    console.log("---------------------------------");

    console.log("--- prepare_new_M_value_for_Update_CD - [ DEBUG: START ] ---");
    console.log(
        "prepare_new_M_value_for_Update_CD 1. Incoming fieldname:",
        fieldname,
    );
    console.log(
        "prepare_new_M_value_for_Update_CD 2. Incoming checked_CD_States:",
        checked_CD_States,
    );
    console.log(
        "prepare_new_M_value_for_Update_CD 3. Incoming old_M_value:",
        old_M_value,
    );

    /**
     * * clone of M_value
     * * M_value = m_data or app_data or entities
     * * , when clicked on Main Tab APP_DATA, M_DATA, ENTITIES
     */
    const new_M_value = { ...old_M_value };
    console.log(
        "prepare_new_M_value_for_Update_CD - 4. Cloned new_M_value:",
        new_M_value,
    );

    /**
     * fieldname_UPPERCASE = PRICE , STOCK
     */
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );
    console.log(
        "prepare_new_M_value_for_Update_CD - 4.1 fieldname_UPPERCASE = ",
        fieldname_UPPERCASE,
    );

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * ['stock' , ['d::DECIMAL' , 10 , 10] , 'u::NUMBER', ['cd::DEFAULT', 0] , 'cud::REQUIRED']
     */
    const field_data = Array.isArray(new_M_value[fieldname_UPPERCASE])
        ? [...new_M_value[fieldname_UPPERCASE]]
        : [];
    console.log(
        "prepare_new_M_value_for_Update_CD - 5. Extracted field_data (before clean):",
        field_data,
    );

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
        "prepare_new_M_value_for_Update_CD - 6. field_data_without_cd_cud (after filtering cd::):",
        field_data_without_cd_cud,
    );

    /**
     * cud_names = ['REQUIRED']
     */
    const cud_names = Object.keys(GLOBAL_METADATA.m_data.cud || {});
    console.log(
        "prepare_new_M_value_for_Update_CD - 6.1. cud_names = ",
        cud_names,
    );

    /**
     * * make new cd , cud to add to new_M_value
     * * [ ['cd::DEFAULT', 0] , 'cud::REQUIRED' , 'cd::INDEX' ]
     */
    const checked_cd_cud_names = checked_CD_States.map((item) => {
        const isCud = cud_names.some(
            (key) => key.toLowerCase() === item.toLowerCase(),
        );

        if (item.toUpperCase() === "DEFAULT") {
            // ใช้ fieldname_UPPERCASE แทน fieldname เพื่อความชัวร์ในการเข้าถึง metadata
            const D_name = DEFAULT_VALUES_for_CD(fieldname_UPPERCASE);
            console.log(
                `prepare_new_M_value_for_Update_CD - 6.2 - DEFAULT_VALUES_for_CD(${fieldname_UPPERCASE}) = `,
                DEFAULT_VALUES_for_CD(fieldname_UPPERCASE),
                " --- D_name = ",
                D_name,
            );
            const prefix = isCud ? "cud" : "cd";
            return [`${prefix}::${item}`, D_name];
        }

        /**
         * * always
         * * config = undefined
         * * I want to know , why AI Gemini add this variable config for what ???
         */
        const config = D_PARAMS_MAP[item.toUpperCase()];
        console.log(
            "prepare_new_M_value_for_Update_CD - 6.3 config = ",
            config,
        );

        if (config) {
            const prefix = isCud ? "cud" : "cd";
            const defaults = config.map((p) => p.default);
            return [`${prefix}::${item}`, ...defaults];
        }

        return isCud ? `cud::${item}` : `cd::${item}`;
    });
    console.log(
        "prepare_new_M_value_for_Update_CD - 7. checked_cd_cud_names =",
        checked_cd_cud_names,
    );

    new_M_value[fieldname_UPPERCASE] = [
        ...field_data_without_cd_cud,
        ...checked_cd_cud_names,
    ];
    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * ['price', Array(3), 'u::NUMBER', 's::CURRENCY', Array(2), 'cud::REQUIRED']
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    console.log(
        "prepare_new_M_value_for_Update_CD - 8. Final new_M_value[fieldname]:",
        new_M_value[fieldname_UPPERCASE],
    );
    console.log(
        "prepare_new_M_value_for_Update_CD - 9. Full final new_M_value:",
        new_M_value,
    );
    console.log("--- prepare_new_M_value_for_Update_CD - [DEBUG: END] ---");

    return new_M_value;
}

/**
 * * find out the default value for d:: cd:: cud:: with params
 * * if params exists, d:: cd:: cud:: are array
 * * e.g. ['cd::DEFAULT', 0] , ['d::DECIMAL', 10, 10]
 * @param {*} fieldname_UPPERCASE
 * @returns
 */
export function DEFAULT_VALUES_for_CD(fieldname_UPPERCASE) {
    const field_data = GLOBAL_METADATA.app_data.f[fieldname_UPPERCASE];

    // default for d::FIELDNAME = ''
    if (!field_data || !field_data[1]) return "";

    /**
     * * d::FIELDNAME can be string or array
     * * if Array , Array[0] = String  always (App Convention)
     * * e.g. [ 'd::DECIMAL', 10, 10 ] of [ 'stock', [ 'd::DECIMAL', 10, 10 ] ]
     * * e.g.   'd::STRING' of [ 'name', 'd::STRING' ]
     */
    /**
     * ค้นหา Element ที่เป็น 'd::...' หรือ [ 'd::...', ... ]
     * ไม่ว่ามันจะอยู่ที่ Index ไหนก็ตาม
     */
    const d_item = field_data.find((item) => {
        const value = Array.isArray(item) ? item[0] : item;
        return typeof value === "string" && value.startsWith("d::");
    });

    // ถ้าหาไม่เจอ ให้ return undefined เพื่อให้ระบบจัดการต่อไป
    if (!d_item) return undefined;

    const d_Class_UPPERCASE = Array.isArray(d_item) ? d_item[0] : d_item;

    console.log(
        "prepare_new_M_value_for_Update_CD - 6.2.1 - 0_M_value_Updater - DEFAULT_VALUES_for_CD - d_Class_UPPERCASE = ",
        d_Class_UPPERCASE,
    );

    /**
     * 'DECIMAL' of 'd::DECIMAL' ->
     */
    const D_NAME = d_Class_UPPERCASE.split("::")[1].toUpperCase();
    console.log(
        "prepare_new_M_value_for_Update_CD - 6.2.2 - 0_M_value_Updater - DEFAULT_VALUES_for_CD - D_NAME = ",
        D_NAME,
    );

    // get from DEFAULT_VALUES_MAP matched D_NAME
    return DEFAULT_VALUES_MAP[D_NAME];
}
