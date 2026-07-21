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
 * @param {*} field_data = e.g.
 * * ['image', 'u::FILE', 'd::INTEGER',  ['cd::DEFAULT', 0] ]
 * * ['price', 'u::NUMBER', ['d::DECIMAL',10,2] ,  ['cd::DEFAULT', 0] ]
 * @returns u_items[0] = 'u::FILE' , 'u::NUMBER'
 * * there is always only one d:: in field_data
 */
export function find_u_item(field_data) {
    const u_item = field_data.find((item) => {
        return typeof item === "string" && item.startsWith("u::");
    });
    return u_item;
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
 * * function for pull D Class from field_data
 * * e.g. ['image', 'd::INTEGER'] -> 'INTEGER'
 */
export function get_U_NAME(field_data) {
    const u_item = find_u_item(field_data);

    if (!u_item) return;

    // pull String
    const base_u_value = Array.isArray(u_item) ? u_item[0] : u_item;

    return base_u_value.replace("u::", "");
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
export function remove_d_u(field_data) {
    if (!Array.isArray(field_data)) return [];
    return field_data.filter((item) => {
        const targetString = Array.isArray(item) ? item[0] : item;
        const isD =
            typeof targetString === "string" && targetString.startsWith("d::");
        const isU =
            typeof targetString === "string" && targetString.startsWith("u::");
        return !isD && !isU;
    });
}

/**
 * * add new d:: get D_Params from D_PARAMS_MAP
 * * e.g. ['image', 'u::TEXT'] -> ['image' , 'd::INTEGER' , 'u::TEXT']
 * * e.g. ['stock', 'u::TEXT'] -> ['stock' , ['d::DECIMAL',10,2] , 'u::TEXT']
 */
export function add_NEW_d_u(field_data_without_d_u, D_NAME, U_NAME) {
    // ADD NEW D
    if (!Array.isArray(field_data_without_d_u)) return [];
    const d_params = find_NEW_D_Params_in_M_MAP(D_NAME);
    let field_data_with_NEW_d = [];
    if (!d_params) {
        field_data_with_NEW_d = [...field_data_without_d_u, `d::${D_NAME}`];
    } else {
        field_data_with_NEW_d = [
            ...field_data_without_d_u,
            [`d::${D_NAME}`, ...d_params],
        ];
    }

    // ADD NEW U
    const field_data_with_NEW_d_u = [...field_data_with_NEW_d, `u::${U_NAME}`];

    return field_data_with_NEW_d_u;
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
export async function remove_D_U_from_Backend() {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();
    const new_M_value = { ...store.M_value };
    const field_data = new_M_value[fieldname.toUpperCase()];
    const field_data_without_d_u = remove_d_u(field_data);
    new_M_value[fieldname.toUpperCase()] = field_data_without_d_u;
    await M_value_Service.update(new_M_value);
}

export async function update_D_U_SAVE_Backend(D_NAME, U_NAME) {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();
    const new_M_value = { ...store.M_value };
    const field_data = new_M_value[fieldname.toUpperCase()];
    const field_data_without_d_u = remove_d_u(field_data);

    const field_data_with_NEW_d_u = add_NEW_d_u(
        field_data_without_d_u,
        D_NAME,
        U_NAME,
    );
    new_M_value[fieldname.toUpperCase()] = field_data_with_NEW_d_u;
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

/**
 *
 * @param {*} FIELDNAME e.g IMAGE , STOCK
 * @returns e.g. TEXT , NUMBER
 */
export function get_U_NAME_by_FIELDNAME(FIELDNAME) {
    const store = use_M_Store.getState();
    const fiel_data = store.M_value[FIELDNAME];
    return get_U_NAME(fiel_data);
}
