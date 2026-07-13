// \resources\js\Components\0_M_Dropdown_D_HEAL.jsx

import { prepare_new_M_value_for_Update_D_All_Fields } from "@/Components/0_M_value_Updater_D_All_Fields";

import { D_PARAMS_MAP } from "@/Components/0_M_MAP";

/**
 * * this function effect on refresh
 * * logic for self healing of d::Class to d_Array
 * 1. save D_params to Backend App_Data.json use M_value_Service.update
 * 2. update JSON_Content - or maybe if GLOBAL_METADATA correct, it maybe solve itself
 * * TODO: we will skip 2 forever if we let JSON_Content update itself
 * * by monitoring a react state hasJSON_Change (every POST by M_value_Service )
 */
export function D_HEAL(
    fieldname,
    selected_D,
    M_value,
    D_params,
    M_value_Service,
) {
    const debug = false;
    if (debug)
        console.log(
            " 0. JKJKJKJKJKJKJK - Dropdown - useEffect - fieldname ",
            fieldname,
            "-------------------------------",
        );
    if (debug)
        console.log(
            " 1. JKJKJKJKJKJKJK - Dropdown - useEffect - Self-Healing on Refresh Logic ",
        );

    if (debug)
        console.log(
            " 2. JKJKJKJKJKJKJK - Dropdown - useEffect - selected_D = ",
            selected_D,
        );
    if (debug)
        console.log(
            " 3. JKJKJKJKJKJKJK - Dropdown - useEffect - D_params = ",
            D_params,
        );

    const config = D_PARAMS_MAP[selected_D];
    if (debug)
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
    if (debug)
        console.log(
            " 5. JKJKJKJKJKJKJK - Dropdown - useEffect - d_Array = ",
            d_Array,
        );

    /**
     * keep D_HEAL.collected for update JSON_Content all at once
     */
    window.D_HEAL.collected[fieldname] = d_Array;

    let new_M_value = null;
    if (window.D_HEAL.isLastField) {
        if (debug)
            console.log(
                " 6. JKJKJKJKJKJKJK - Dropdown - useEffect - window.D_HEAL.collected = ",
                window.D_HEAL.collected,
            );

        /**
         * * TODO :
         * * renew this function to update M_value
         * * by window.D_HEAL.collected all at once
         */
        new_M_value = prepare_new_M_value_for_Update_D_All_Fields(
            window.D_HEAL.collected,
            M_value,
        );

        if (debug)
            console.log(
                " 7. JKJKJKJKJKJKJK - Dropdown - useEffect - new_M_value = ",
                new_M_value,
            );
    }
    if (!new_M_value) return; //turn off only on debug

    M_value_Service.update(new_M_value).then(() => {
        if (debug)
            console.log(
                " 8 JKJKJKJKJKJKJK [ SUCCESS - Self-Healing ] Data saved to Backend SUCCESSFULLY.",
            );
    });
}
