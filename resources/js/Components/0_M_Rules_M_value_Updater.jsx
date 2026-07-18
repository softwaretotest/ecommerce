// \resources\js\Components\0_M_Rules_M_value_Updater.jsx

import { M_value_Service } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";

import { prepare_new_M_value_for_Update_CU } from "@/Components/0_M_value_Updater_CU";
import { prepare_new_M_value_for_Update_CD } from "@/Components/0_M_value_Updater_CD";

export async function update_M_value_for_checked_CD_CU() {
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();

    const new_M_value_CU_updated = await prepare_new_M_value_for_Update_CU(
        use_M_Store.getState().M_value,
        fieldname,
        use_M_Store.getState().checked_CU[fieldname],
    );

    const new_M_value_CU_CD_updated = await prepare_new_M_value_for_Update_CD(
        new_M_value_CU_updated,
        fieldname,
        use_M_Store.getState().checked_CD[fieldname],
    );

    await M_value_Service.update(new_M_value_CU_CD_updated);
}
