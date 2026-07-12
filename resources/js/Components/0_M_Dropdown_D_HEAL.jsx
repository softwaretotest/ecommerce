// \resources\js\Components\0_M_Dropdown_D_HEAL.jsx

import { M_value_Service } from "@/Services/0_M_value_Service";

import { prepare_new_M_value_for_Update_D_self_heal } from "@/Components/0_M_Dropdown_D_params_self_heal";
import { D_PARAMS_MAP } from "@/Components/0_M_MAP";

/**
 * * this function effect on refresh
 * * logic for self healing of d::Class to d_Array
 * 1. save D_params to Backend App_Data.json use M_value_Service.update
 * 2. update JSON_Content - or maybe if GLOBAL_METADATA correct, it maybe solve itself
 * * TODO: we will skip 2 forever if we let JSON_Content monitor backend
 * * by monitoring a react state hasJSON_Change
 */
export function D_HEAL(fieldname, selected_D, M_value, set_M_value, D_params) {
    console.log(
        " 0. JKJKJKJKJKJKJK - Dropdown - useEffect - fieldname ",
        fieldname,
        "-------------------------------",
    );
    console.log(
        " 1. JKJKJKJKJKJKJK - Dropdown - useEffect - Self-Healing on Refresh Logic ",
    );

    console.log(
        " 2. JKJKJKJKJKJKJK - Dropdown - useEffect - selected_D = ",
        selected_D,
    );
    console.log(
        " 3. JKJKJKJKJKJKJK - Dropdown - useEffect - D_params = ",
        D_params,
    );

    const config = D_PARAMS_MAP[selected_D];
    console.log(
        " 4. JKJKJKJKJKJKJK - Dropdown - useEffect - config = ",
        config,
    );

    if (!config) return;

    const d_Array = [
        // if 'd::STRING' = wrong , must be Array made by D_PARAMS_MAP
        `d::${selected_D}`,
        ...D_PARAMS_MAP[selected_D].map((p) => p.default),
    ]; // return e.g. ['d::STRING',255]
    console.log(
        " 5. JKJKJKJKJKJKJK - Dropdown - useEffect - d_Array = ",
        d_Array,
    );

    /**
     * keep D_HEAL.collected for update JSON_Content all at once
     */
    window.D_HEAL.collected[fieldname] = d_Array;

    const new_M_value = prepare_new_M_value_for_Update_D_self_heal(
        selected_D,
        d_Array,
        M_value,
        set_M_value,
        fieldname.toUpperCase(),
    );

    // console.log(
    //     " 6. JKJKJKJKJKJKJK - Dropdown - useEffect - new_M_value = ",
    //     new_M_value,
    // );

    // 2. อัปเดต Store ทันทีเพื่อให้ UI ทุกจุดอัปเดต
    set_M_value(new_M_value);

    // 3. บันทึก Backend (ให้ถาวร)
    M_value_Service.update(new_M_value).then(() => {
        console.log("[Self-Healing] Data saved to Backend successfully.");
        // 4. อัปเดต JSON View
        if (window.D_HEAL.isLastField) {
            console.log(
                " 7. JKJKJKJKJKJKJK - Dropdown - useEffect - window.D_HEAL.collected = ",
                window.D_HEAL.collected,
            );
        }
        // setJSON_Content_State(<JSON_Content M_value={new_M_value} />);}
    });
}
