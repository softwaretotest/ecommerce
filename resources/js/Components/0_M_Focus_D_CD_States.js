// 0_M_Focus_D_CD_States.js

import { GLOBAL_METADATA } from "@/Services/0_M_DataProvider.jsx";
/**
 * set CD_States (global), when click on App-Data-Field on Sidebar or TabContent
 * @param {*} fieldname string, decimal, boolean
 * @param {*} M_Value { BOOLEAN: 'boolean', DEFAULT: 'default', DECIMAL: 'decimal', STRING: 'string', FOREIGN: 'foreign' }
 */
export function set_Focus_D_CD_States(fieldname, M_Value) {
    // we set_CD_States only wenn Parent Tab = 'APP DATA'
    const is_AppData =
        GLOBAL_METADATA?.app_data._comment.includes("App-Data.json");
    if (!is_AppData) return;

    const m_data = GLOBAL_METADATA.m_data;
    const cd = m_data.cd;
    const cud = m_data.cud;

    const all_DB_constraints = { ...cd, ...cud };

    const CD_States = {};

    for (const item in all_DB_constraints) {
        CD_States[item] = false;
    }

    /**
     * for now , we don't set M_States for Class d , u , cd , cu , cud , t
     * only Class with Array item e. g. Class f , s
     */
    function extract_cd_cud(focused_M_Field) {
        if (!Array.isArray(focused_M_Field)) return;

        const cd = [];
        const cud = [];
        focused_M_Field.forEach((item) => {
            // in M Convention: if not string , it is array with array[0].typeOf String
            const val = Array.isArray(item) ? item[0] : item;

            if (val.startsWith("cd::")) {
                cd.push(val.replace("cd::", ""));
            } else if (val.startsWith("cud::")) {
                cud.push(val.replace("cud::", ""));
            }
        });

        return [...cd, ...cud];
    }

    function extract_d(focused_M_Field, fieldname) {
        if (!Array.isArray(focused_M_Field)) return;
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

    const focused_M_Field = M_Value[fieldname];

    const cd_cud_of_focused_M_Field = extract_cd_cud(focused_M_Field);

    const D_States = extract_d(focused_M_Field, fieldname);

    return [D_States, CD_States];
}
