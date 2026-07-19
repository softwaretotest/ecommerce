// \resources\js\Components\0_M_Data_Helper.js
import { M_value_Service } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";
import { find_NEW_D_Params_in_M_MAP } from "@/Components/0_M_D_Params_Service";

/**
 * @param {*} field_data = e.g.
 * * ['image', 'u::FILE', 'd::INTEGER',  ['cd::DEFAULT', 0] ]
 * * ['price', 'u::NUMBER', ['d::DECIMAL',10,2] ,  ['cd::DEFAULT', 0] ]
 * @returns d_items[0] = 'd::INTEGER' or ['d::DECIMAL',10,2]
 * * there is always only one d:: in field_data
 */
export function find_d_item(field_data) {
    const d_item = field_data.find((item) => {
        const value = Array.isArray(item) ? item[0] : item;
        return typeof value === "string" && value.startsWith("d::");
    });
    return d_item;
}

/**
 * * function for pull D Class from field_data
 * * e.g. ['image', 'd::INTEGER'] -> 'INTEGER'
 */
export function get_D_NAME(field_data) {
    const d_item = find_d_item(field_data);

    if (!d_item) return;

    // pull String
    const base_d_value = Array.isArray(d_item) ? d_item[0] : d_item;

    return base_d_value.replace("d::", "");
}

/**
 * * remove all cd: from field_data
 * * e.g. ['image', 'cd::INDEX' , 'u::TEXT'] -> ['image', 'u::TEXT']
 * * e.g. ['image', ['cd::DEFAULT',10,2] ] -> ['image']
 */
export function remove_cd(field_data) {
    if (!Array.isArray(field_data)) return [];
    return field_data.filter((item) => {
        const targetString = Array.isArray(item) ? item[0] : item;
        const isCD =
            typeof targetString === "string" && targetString.startsWith("cd::");
        return !isCD;
    });
}

/**
 * * remove all d: from field_data
 * * e.g. ['image', 'd::STRING' , 'u::TEXT'] -> ['image', 'u::TEXT']
 * * e.g. ['image', ['d::STRING',255] ] -> ['image']
 */
export function remove_d(field_data) {
    if (!Array.isArray(field_data)) return [];
    return field_data.filter((item) => {
        const targetString = Array.isArray(item) ? item[0] : item;
        const isD =
            typeof targetString === "string" && targetString.startsWith("d::");
        return !isD;
    });
}

/**
 * * add new d:: get D_Params from D_PARAMS_MAP
 * * e.g. ['image', 'u::TEXT'] -> ['image' , 'd::INTEGER' , 'u::TEXT']
 * * e.g. ['stock', 'u::TEXT'] -> ['stock' , ['d::DECIMAL',10,2] , 'u::TEXT']
 */
export function add_NEW_d(field_data_without_d, D_NAME) {
    if (!Array.isArray(field_data_without_d)) return [];
    const d_params = find_NEW_D_Params_in_M_MAP(D_NAME);
    console.log(
        `!!!!!! Data_Helper - add_NEW_d - d_params of ${D_NAME} = `,
        d_params,
    );
    let field_data_with_NEW_d = [];
    if (!d_params) {
        field_data_with_NEW_d = [...field_data_without_d, `d::${D_NAME}`];
    } else {
        field_data_with_NEW_d = [
            ...field_data_without_d,
            [`d::${D_NAME}`, ...d_params],
        ];
    }
    return field_data_with_NEW_d;
}

/**
 * * check if field_data has "d::NAME" or ["d::NAME", params ]
 */
export function has_d_in_field_data(field_data) {
    if (!Array.isArray(field_data)) return false;

    return field_data.some((item) => {
        const targetString = Array.isArray(item) ? item[0] : item;

        return (
            typeof targetString === "string" && targetString.startsWith("d::")
        );
    });
}

/**
 * * check if field_data has "d::NAME" or ["d::NAME", params ]
 * * this func. called e.g. onChange of checkbox FOREIGN
 * * before calling value_updater_CD, where cd::FOREIGN
 * * will be added to M_value Backend like any other CDs
 */
export async function remove_D_from_Backend() {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();
    const new_M_value = { ...store.M_value };
    const field_data = new_M_value[fieldname.toUpperCase()];
    const field_data_without_d = remove_d(field_data);
    new_M_value[fieldname.toUpperCase()] = field_data_without_d;
    await M_value_Service.update(new_M_value);
}

export async function update_D_SAVE_Backend(D_NAME) {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();
    const new_M_value = { ...store.M_value };
    const field_data = new_M_value[fieldname.toUpperCase()];
    const field_data_without_d = remove_d(field_data);

    const field_data_with_NEW_d = add_NEW_d(field_data_without_d, D_NAME);
    console.log(
        "!!!!!!!! Data_Helper - update_D_SAVE_Backend - field_data_with_NEW_d = ",
        field_data_with_NEW_d,
    );
    new_M_value[fieldname.toUpperCase()] = field_data_with_NEW_d;
    await M_value_Service.update(new_M_value);
}

/**
 *
 * @param {*} FIELDNAME e.g IMAGE , STOCK
 * @returns e.g. INTEGER , DECIMAL
 */
export function get_D_NAME_by_FIELDNAME(FIELDNAME) {
    const store = use_M_Store.getState();
    const fiel_data = store.M_value[FIELDNAME];
    return get_D_NAME(fiel_data);
}
