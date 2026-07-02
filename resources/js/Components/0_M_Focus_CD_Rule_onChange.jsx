// 0_M_Focus_CD_Rule_onChange.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { prepare_new_M_value_for_Update } from "./0_M_value_Updater";

/**
 * set onChange Action for D CD checkboxes , dropdowns , inputs
 * @param {*} element_DOM e.g. <input type="checkbox" value="DEFAULT">
 * @param {*} old_M_value from drilled params from SubTab
 */
export function Focus_CD_Rule_onChange({
    element_DOM,
    old_M_value,
    field_data,
}) {
    console.group("--- [DEBUG: Focus_CD_Rule_onChange] ---");
    console.log("element_DOM = ", element_DOM);
    console.log("element_DOM.value = ", element_DOM.value);
    console.log("old_M_value = ", old_M_value);
    console.log("field_data = ", field_data);

    // 1. ดึง Action จาก Store
    const set_M_value = use_M_Store.getState().set_M_value;

    // 2. คว้านไส้ (Extract) สถานะปัจจุบันของ field นั้นๆ ออกมาเป็น Object
    const fieldname = field_data[0];

    // สร้าง Object สถานะจำลอง (Atomic State Object)
    const DEFAULT = field_data.includes("cd::DEFAULT");
    const FOREIGN = field_data.includes("cd::FOREIGN");
    const INDEX = field_data.includes("cd::INDEX");
    const NULLABLE = field_data.includes("cd::NULLABLE");
    const UNIQUE = field_data.includes("cd::UNIQUE");
    const REQUIRED = field_data.includes("cud::REQUIRED");

    const states = { DEFAULT, FOREIGN, INDEX, NULLABLE, UNIQUE, REQUIRED };
    console.log("Current States (Atomic):", states);

    if (!DEFAULT || !FOREIGN || !INDEX || !NULLABLE || !UNIQUE || !REQUIRED) {
        console.warn("Skipping: Some states are missing in field_data");
        console.groupEnd();
        return;
    }

    // 3. ใส่กฎความสัมพันธ์ (Policy Layer)
    if (DEFAULT) console.log("DEFAULT INPUT EXISTS");
    if (FOREIGN) console.log("FOREIGN INPUT EXISTS");
    if (INDEX) console.log("INDEX INPUT EXISTS");
    if (NULLABLE) console.log("NULLABLE INPUT EXISTS");
    if (UNIQUE) console.log("UNIQUE INPUT EXISTS");
    if (REQUIRED) console.log("REQUIRED INPUT EXISTS");

    // เตรียมตัวแปร next_states สำหรับอัปเดต
    let next_states = { ...states };
    // ตรงนี้จะใส่ Logic ปรับแต่ง next_states ต่อไป

    // 4. แปลง next_states กลับเป็น Array สำหรับ prepare_new_M_value_for_Update
    const checked_CD_States = Object.keys(next_states).filter(
        (key) => next_states[key],
    );
    console.log("checked_CD_States = ", checked_CD_States);

    // 5. สั่งอัปเดต Store ครั้งเดียวจบ
    const new_M_value = prepare_new_M_value_for_Update(
        old_M_value,
        fieldname,
        checked_CD_States,
    );

    set_M_value(new_M_value);
    console.log("Store Updated Successfully");
    console.groupEnd();
}
