// resources/js/Components/0_M_Focus_CD_Rule_onChange.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { prepare_new_M_value_for_Update_CD } from "./0_M_value_Updater_CD";

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
    // console.log("element_DOM = ", element_DOM);
    // console.log("element_DOM.value = ", element_DOM.value);
    // console.log("old_M_value = ", old_M_value);
    // console.log("field_data_in_M_value = ", field_data_in_M_value);
    // console.group("---------------------------------------");

    // 1. ดึง Action จาก Store
    const set_M_value = use_M_Store.getState().set_M_value;
    const M_value = use_M_Store.getState().M_value;

    // 2. คว้านไส้ (Extract) สถานะปัจจุบันของ field นั้นๆ ออกมาเป็น Object
    const fieldname = field_data[0];

    // สร้าง Object สถานะจำลอง (Atomic State Object)
    let DEFAULT = isExist_CD_in_M_value(fieldname, "cd::DEFAULT");
    let FOREIGN = isExist_CD_in_M_value(fieldname, "cd::FOREIGN");
    let INDEX = isExist_CD_in_M_value(fieldname, "cd::INDEX");
    let NULLABLE = isExist_CD_in_M_value(fieldname, "cd::NULLABLE");
    let UNIQUE = isExist_CD_in_M_value(fieldname, "cd::UNIQUE");
    let REQUIRED = isExist_CD_in_M_value(fieldname, "cud::REQUIRED");

    // TEST if exist
    // if (DEFAULT) console.log("DEFAULT INPUT EXISTS");
    // if (FOREIGN) console.log("FOREIGN INPUT EXISTS");
    // if (INDEX) console.log("INDEX INPUT EXISTS");
    // if (NULLABLE) console.log("NULLABLE INPUT EXISTS");
    // if (UNIQUE) console.log("UNIQUE INPUT EXISTS");
    // if (REQUIRED) console.log("REQUIRED INPUT EXISTS");

    /**
     * * HERE we use the Atomic above to
     * * 1. calculate checkbox logic
     * * 2. update M_value in M_Store
     * * 3. to auto .update UI  e.g. if(NULLABLE = checked) then REQUIRED unchecked
     * *
     */

    /**
     * last clicked checkbox
     * e.g. DEFAULT , FOREIGN etc.
     */
    const ACTION_VALUE = element_DOM.value;
    console.log("ACTION_VALUE = ", ACTION_VALUE);

    /**
     * * 1. calculate checkbox logic
     */

    // NULLABLE vs REQUIRED
    if (ACTION_VALUE === "NULLABLE" && NULLABLE) {
        REQUIRED = false;
        remove_from_M_value("cd::REQUIRED", fieldname, element_DOM);
    }
    if (ACTION_VALUE === "REQUIRED" && REQUIRED) {
        NULLABLE = false;
        remove_from_M_value("cd::NULLABLE", fieldname, element_DOM);
    }

    console.log("DEFAULT = ", DEFAULT);
    console.log("FOREIGN = ", FOREIGN);
    console.log("INDEX = ", INDEX);
    console.log("NULLABLE = ", NULLABLE);
    console.log("UNIQUE = ", UNIQUE);
    console.log("REQUIRED = ", REQUIRED);
}

/**
 *
 * @param {*} fieldname
 * @param {*} cd_Class = e.g. cd::DEFAULT
 * @returns
 */
export function isExist_CD_in_M_value(fieldname, cd_Class) {
    const M_value = use_M_Store.getState().M_value;
    const fieldname_UPPERCASE = fieldname.toUpperCase();
    const field_data_in_M_value = M_value[fieldname_UPPERCASE];

    if (!field_data_in_M_value || !Array.isArray(field_data_in_M_value))
        return false;

    return field_data_in_M_value.some((item) => {
        if (typeof item === "string") return item === cd_Class;
        if (Array.isArray(item)) return item[0] === cd_Class;
        return false;
    });
}

/**
 * e.g. remove_from_M_value("cd::REQUIRED", fieldname);
 * @param {*} cd_Name = e.g. cd::REQUIRED
 * @param {*} fieldname = e.g. image , price , stock , name etc.
 */
function remove_from_M_value(cd_Name, fieldname, element_DOM) {
    const { M_value, set_M_value } = use_M_Store.getState();

    const fieldname_UPPERCASE = fieldname.toUpperCase();
    const field_data_from_M_value = M_value[fieldname_UPPERCASE];
    if (!field_data_from_M_value) return;

    // console.log("field_data_from_M_value before splice:", field_data_from_M_value);

    const index = field_data_from_M_value.indexOf(cd_Name);
    if (index > -1) {
        field_data_from_M_value.splice(index, 1);
        // console.log(
        //     " field_data_from_M_value after splice = ",
        //     field_data_from_M_value,
        // );
        set_M_value({ ...M_value });
        console.log(" ...M_value = ", M_value);

        //------- update UI Does not work auto. because React checked_CD this State lock checkboxes
        // we must drill checked_CD to here
        // 1. หา wrapper ใหญ่สุด
        const wrapper = element_DOM.closest(".field-wrapper-box");
        const cd_Class_Clean =
            cd_Name.split("cd::")[1] || cd_Name.split("cud::")[1];

        // 2. ยิง Event บอกให้ Component นั้นๆ รับทราบ
        const event = new CustomEvent("request-uncheck", {
            detail: { value: cd_Class_Clean },
        });
        wrapper.dispatchEvent(event);
        //----------------------will be removed obove------------------------------------------------
    }
}

function save_to_M_value(is_CD_Checked, cd_Class, fieldname) {
    const { M_value, set_M_value } = use_M_Store.getState();
    const field_data_from_M_value = [...(M_value[fieldname] || [])];

    // กำหนดชื่อ Rule เต็มที่ใช้ใน Array
    const cd_NAME_Class_Map = {
        DEFAULT: "cd::DEFAULT",
        FOREIGN: "cd::FOREIGN",
        INDEX: "cd::INDEX",
        NULLABLE: "cd::NULLABLE",
        UNIQUE: "cd::UNIQUE",
        REQUIRED: "cud::REQUIRED",
    };

    const cd_Name = cd_NAME_Class_Map[cd_Class];

    if (is_CD_Checked) {
        // เพิ่ม Rule ถ้ายังไม่มี
        if (!field_data_from_M_value.includes(cd_Name)) {
            field_data_from_M_value.push(cd_Name);
        }
    } else {
        // ลบ Rule ออก
        const index = field_data_from_M_value.indexOf(cd_Name);
        if (index > -1) {
            field_data_from_M_value.splice(index, 1);
        }
    }

    // อัปเดต Store
    const new_M_value = {
        ...M_value,
        [fieldname]: field_data_from_M_value,
    };

    set_M_value(new_M_value);
}
