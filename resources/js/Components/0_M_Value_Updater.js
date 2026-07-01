// 0_M_Value_Updater.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import {
    FIELD_PARAMS_MAP,
    DEFAULT_VALUES_MAP,
} from "@/Components/0_field_params_map";

export function prepare_new_M_Value_for_Update(
    old_M_Value,
    fieldname,
    checked_CD_States,
) {
    console.log(
        "0. GLOBAL_METADATA.app_data.f.IMAGE[1] :",
        GLOBAL_METADATA.app_data.f.IMAGE[1],
    );
    console.log("---------------------------------");

    console.log("--- [DEBUG: prepare_new_M_Value] ---");
    console.log("1. Incoming fieldname:", fieldname);
    console.log("2. Incoming checked_CD_States:", checked_CD_States);
    console.log("3. Incoming old_M_Value:", old_M_Value);

    // 1. Create new data object by cloning the old one
    const new_M_Value = { ...old_M_Value };
    console.log("4. Cloned new_M_Value:", new_M_Value);

    // [แก้ไขเฉพาะจุดนี้]: Search for the actual key, case-insensitive
    const actualKey = Object.keys(new_M_Value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );

    // 2. Extract the field data (using the actual key found)
    const fieldData = Array.isArray(new_M_Value[actualKey])
        ? [...new_M_Value[actualKey]]
        : [];
    console.log("5. Extracted fieldData (before clean):", fieldData);

    // 3. Filter out all existing cd:: and cud:: values
    const cleanData = fieldData.filter((item) => {
        // ถ้าเป็น Array ให้ตรวจสอบที่ index 0 ถ้าเป็น String ให้ตรวจสอบตัวมันเอง
        const targetString = Array.isArray(item) ? item[0] : item;

        const isCD =
            typeof targetString === "string" && targetString.startsWith("cd::");
        const isCUD =
            typeof targetString === "string" &&
            targetString.startsWith("cud::");

        return !isCD && !isCUD;
    });
    console.log("6. cleanData (after filtering cd::):", cleanData);

    // 4. Add the new checked_CD_States, determining prefix based on metadata
    const cud_keys = Object.keys(GLOBAL_METADATA.m_data.cud || {});
    const formattedCD = checked_CD_States.map((item) => {
        const isCud = cud_keys.some(
            (key) => key.toLowerCase() === item.toLowerCase(),
        );

        if (item.toUpperCase() === "DEFAULT") {
            // ใช้ actualKey แทน fieldname เพื่อความชัวร์ในการเข้าถึง metadata
            const defaultValue = getDefaultForType(actualKey);

            const prefix = isCud ? "cud" : "cd";
            return [`${prefix}::${item}`, defaultValue];
        }

        // กรณีปกติ: จัดการ Parameter อื่นๆ
        const config = FIELD_PARAMS_MAP[item.toUpperCase()];
        if (config) {
            const prefix = isCud ? "cud" : "cd";
            const defaults = config.map((p) => p.default);
            return [`${prefix}::${item}`, ...defaults];
        }

        return isCud ? `cud::${item}` : `cd::${item}`;
    });
    console.log("7. formattedCD (new items):", formattedCD);

    // 5. Update the field data (using actualKey to ensure update to the correct key)
    new_M_Value[actualKey] = [...cleanData, ...formattedCD];
    console.log("8. Final new_M_Value[fieldname]:", new_M_Value[actualKey]);
    console.log("9. Full final new_M_Value:", new_M_Value);
    console.log("--- [DEBUG: END] ---");

    return new_M_Value;
}

// ฟังก์ชันสำหรับดึงค่าเริ่มต้นตาม Type จาก Metadata
function getDefaultForType(keyName) {
    const fieldData = GLOBAL_METADATA.app_data.f[keyName];

    // ถ้าไม่พบข้อมูลให้ default เป็น string ว่าง
    if (!fieldData || !fieldData[1]) return "";

    // ตรวจสอบว่า fieldData[1] เป็น Array หรือ String
    // ถ้าเป็น Array [ 'd::DECIMAL', 10, 10 ] ให้เอาตัวแรก ถ้าเป็น String ให้ใช้ตัวมันเอง
    const rawTypeString = Array.isArray(fieldData[1])
        ? fieldData[1][0]
        : fieldData[1];

    // สกัดเอา Type ออกมา (เช่น 'd::DECIMAL' -> 'DECIMAL')
    const type = rawTypeString.split("::")[1].toUpperCase();

    // ดึงค่าจาก DEFAULT_VALUES_MAP ตาม Type ที่ได้
    return DEFAULT_VALUES_MAP[type] ?? "";
}
