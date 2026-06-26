// 0_M_CheckBox.jsx
import { CD_Rule } from "@/Components/0_M_Rule_CD.jsx";
import { UI_Rule } from "@/Components/0_M_Rule_UI.jsx";

export function renderCheckboxList(
    M_Class_Name_List,
    fieldDataList = [],
    getOptions_for_Checkbox_or_Dropdown,
    groupLabel, // CD , CU
) {
    // 1. กรองเฉพาะข้อมูลที่อยู่ในกลุ่มที่เกี่ยวข้องกับ Column นี้
    const foundValues = fieldDataList.filter((item) => {
        let val = Array.isArray(item) ? item[0] : item;
        return (
            typeof val === "string" &&
            M_Class_Name_List.some((c) => val.startsWith(c + "::"))
        );
    });

    // 2. แยก Data ตามประเภท (โดยตัด prefix ออก)
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
                      M_Class_Name_List.flatMap((M_Class_Name) =>
                          getOptions_for_Checkbox_or_Dropdown(M_Class_Name),
                      ),
                  ),
              )
            : []; // if no CD selected

    const ALL_UI_options =
        groupLabel === "CU"
            ? Array.from(
                  new Set(
                      M_Class_Name_List.flatMap((M_Class_Name) =>
                          getOptions_for_Checkbox_or_Dropdown(M_Class_Name),
                      ),
                  ),
              )
            : [];

    return (
        <>
            <CD_Rule DB_options={DB_options} ALL_DB_options={ALL_DB_options} />
            <UI_Rule UI_options={UI_options} ALL_UI_options={ALL_UI_options} />
        </>
    );
}
