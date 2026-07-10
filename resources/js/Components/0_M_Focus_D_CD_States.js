import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";

/**
 * set CD_States (global), when click on App-Data-Field on Sidebar or TabContent
 * @param {*} fieldname string, decimal, boolean
 * @param {*} M_Value { BOOLEAN: 'boolean', DEFAULT: 'default', DECIMAL: 'decimal', STRING: 'string', FOREIGN: 'foreign' }
 */
export function set_Focus_D_CD_States(fieldname, M_Value) {
    const is_AppData =
        GLOBAL_METADATA?.app_data._comment.includes("App-Data.json");
    if (!is_AppData) return;

    const { cd, cud } = GLOBAL_METADATA.m_data;
    const CD_States = initialize_CD_States({ ...cd, ...cud });
    const focused_M_Field = M_Value[fieldname];

    const cd_cud_list = extract_cd_cud(focused_M_Field);

    /**
     * update CD_States after extracted
     * VERY IMPORT CODE, DO NOT DELETE
     * oterwise, onClick Field will not update CD_States
     */
    cd_cud_list.forEach((item) => {
        if (item in CD_States) {
            CD_States[item] = true;
        }
    });

    const D_States = extract_d(focused_M_Field, fieldname);

    return [D_States, CD_States];
}

function initialize_CD_States(constraints) {
    const states = {};
    for (const item in constraints) {
        states[item] = false;
    }
    return states;
}

function extract_cd_cud(focused_M_Field) {
    if (!Array.isArray(focused_M_Field)) return [];

    const results = [];
    focused_M_Field.forEach((item) => {
        const val = Array.isArray(item) ? item[0] : item;
        if (val.startsWith("cd::") || val.startsWith("cud::")) {
            results.push(val.replace("cd::", "").replace("cud::", ""));
        }
    });
    return results;
}

function extract_d(focused_M_Field, fieldname) {
    if (!Array.isArray(focused_M_Field)) return { fieldname: fieldname };

    let D_States = { fieldname: fieldname };
    focused_M_Field.forEach((item) => {
        const val = Array.isArray(item) ? item[0] : item;
        if (val.startsWith("d::")) {
            const dataType = val.replace("d::", "").toUpperCase();
            D_States[dataType] = dataType.toLowerCase();
        }
    });
    return D_States;
}
