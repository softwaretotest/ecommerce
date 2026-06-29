// 0_M_CheckBox.jsx
import { use_M_Option } from "@/Hooks/use_M_Option.js";
import { CD_Rule } from "@/Components/0_M_Rule_D_CD.jsx";
import { UI_Rule } from "@/Components/0_M_Rule_U_UI.jsx";

export function renderCheckboxList(
    M_Class_Name_List,
    fieldDataList = [],
    groupLabel,
) {
    const { getOptions } = use_M_Option();

    console.log("0_M_CheckBox.jsx - M_Class_Name_List:", M_Class_Name_List);
    console.log("0_M_CheckBox.jsx - fieldDataList:", fieldDataList);

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
        groupLabel === "CD"
            ? Array.from(
                  new Set(
                      M_Class_Name_List.flatMap((name) => getOptions(name)),
                  ),
              )
            : [];

    const ALL_UI_options =
        groupLabel === "CU"
            ? Array.from(
                  new Set(
                      M_Class_Name_List.flatMap((name) => getOptions(name)),
                  ),
              )
            : [];

    console.log("0_M_CheckBox.jsx - DB_options:", DB_options);
    console.log("0_M_CheckBox.jsx - UI_options:", UI_options);

    return (
        <>
            <CD_Rule DB_options={DB_options} ALL_DB_options={ALL_DB_options} />
            <UI_Rule UI_options={UI_options} ALL_UI_options={ALL_UI_options} />
        </>
    );
}
