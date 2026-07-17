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
 * function for pull D Class from field_data
 * e.g. ['image', 'd::INTEGER'] -> 'INTEGER'
 */
export function get_D_NAME(field_data) {
    const d_item = find_d_item(field_data);

    // pull String
    const base_d_value = Array.isArray(d_item) ? d_item[0] : d_item;

    return base_d_value.replace("d::", "");
}

// export function find_u_item(field_data) {
//     const u_item = field_data.find((item) => {
//         const value = item;
//         return typeof value === "string" && value.startsWith("u::");
//     });
//     return u_item;
// }

// /**
//  * function for pull D Class from field_data
//  * e.g. ['image', 'd::INTEGER'] -> 'INTEGER'
//  */
// export function get_U_NAME(field_data) {
//     const u_item = find_u_item(field_data);
//     return u_item.replace("u::", "");
// }
