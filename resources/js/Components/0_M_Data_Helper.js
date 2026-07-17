// \resources\js\Components\0_M_Data_Helper.js

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
