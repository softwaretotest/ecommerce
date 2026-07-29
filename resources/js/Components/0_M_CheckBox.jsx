// resources/js/Components/0_M_CheckBox.jsx
import { useEffect, useState } from "react";

import { use_M_Option } from "@/Hooks/use_M_Option.js";
import { CD_Rule } from "@/Components/0_M_Rule_D_CD";
import { CU_Rule } from "@/Components/0_M_Rule_U_CU";
import { use_M_Store } from "@/Stores/0_M_Store";

export function renderCheckboxList(M_Class_Name_List, group_label, field_data) {
    const debug = false && field_data[0] === "image";
    const [fieldname, ...fieldDataList] = field_data;

    const { getOptions } = use_M_Option();

    if (debug)
        console.log(" 0. START----------------------------------------------");
    if (debug) console.log(" 1. 0_M_CheckBox.jsx - field_data:", field_data);
    if (debug)
        console.log(" 1. START----------------------------------------------");
    if (debug)
        console.log(
            " 1. 0_M_CheckBox.jsx - M_Class_Name_List:",
            M_Class_Name_List,
        );
    if (debug)
        console.log(" 1. 0_M_CheckBox.jsx - fieldDataList:", fieldDataList);
    if (debug) console.log(" 1. 0_M_CheckBox.jsx - group_label:", group_label);
    if (debug)
        console.log(" 1. ------------------------------------------------END");

    if (!Array.isArray(fieldDataList)) return null;

    const foundValues = fieldDataList.filter((item) => {
        let val = Array.isArray(item) ? item[0] : item;
        return (
            typeof val === "string" &&
            M_Class_Name_List.some((c) => val.startsWith(c + "::"))
        );
    });

    const DB_options = foundValues
        .filter((v) => {
            const val = Array.isArray(v) ? v[0] : v;
            return val.startsWith("cd::") || val.startsWith("cud::");
        })
        .map((v) => (Array.isArray(v) ? v[0] : v).split("::")[1]);

    const UI_options = foundValues
        .filter((v) => {
            const val = Array.isArray(v) ? v[0] : v;
            return val.startsWith("u::") || val.startsWith("cud::");
        })
        .map((v) => (Array.isArray(v) ? v[0] : v).split("::")[1]);

    const ALL_DB_options =
        group_label === "CD"
            ? Array.from(
                  new Set(
                      M_Class_Name_List.flatMap((name) => getOptions(name)),
                  ),
              )
            : [];

    const ALL_UI_options =
        group_label === "CU"
            ? Array.from(
                  new Set(
                      M_Class_Name_List.flatMap((name) => getOptions(name)),
                  ),
              )
            : [];

    const [checked_CD, setChecked_CD] = useState(DB_options);
    const [checked_CU, setChecked_CU] = useState(UI_options);

    if (debug) console.log(" 2. 0_M_CheckBox.jsx - DB_options:", DB_options);
    if (debug)
        console.log(" 2. 0_M_CheckBox.jsx - ALL_DB_options:", ALL_DB_options);
    if (debug) console.log(" 3. 0_M_CheckBox.jsx - UI_options:", UI_options);
    if (debug)
        console.log(" 3. 0_M_CheckBox.jsx - ALL_UI_options:", ALL_UI_options);

    return (
        <>
            <CD_Rule
                DB_options={DB_options}
                ALL_DB_options={ALL_DB_options}
                field_data={field_data}
            />
            <CU_Rule
                UI_options={UI_options}
                ALL_UI_options={ALL_UI_options}
                field_data={field_data}
            />
        </>
    );
}
