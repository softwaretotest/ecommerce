// resources/js/Components/0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { update_M_value_for_checked_CD_CU } from "@/Components/0_M_Rules_M_value_Updater";
import { validate_UI } from "@/Components/0_M_Rules";

import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";

import { get_D_NAME, has_d_in_field_data } from "@/Components/0_M_Data_Helper";

/**
 * Rule Fabric for onChange of CD Checkboxes (not done yet)
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (selected options)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (all allow options)
 */
export function CD_Rule({ DB_options, ALL_DB_options, field_data }) {
    const debug = false;
    /**
     * field_data[] first element is fieldname
     */
    const fieldname = field_data[0];

    /**
     * * DROPDOWN - Handling
     * * -----------------
     */
    const activeSubTab = use_M_Store((state) => state.activeSubTab);

    const set_selected_D_FOREIGN =
        use_M_Store.getState().set_selected_D_FOREIGN;
    const set_selected_U_FOREIGN =
        use_M_Store.getState().set_selected_U_FOREIGN;

    /**
     * * CHECKBOX - Handling
     * * --------------------
     * * otherwise  checked_CD.includes(option);
     * * Uncaught TypeError: Cannot read properties of undefined (reading 'includes')
     * * LOG CD CU said:
     * * [M_STORE_DEBUG]     state.checked_CD[image] : undefined
     * * [M_STORE_DEBUG] New state.checked_CU[image] : []
     * * We cannot prevent React fist render too fast , before data checked_Cx is ready
     * * :::: SOLUTION :::: WORKAROUND
     * * send empty || [] instead of undefined
     */
    const checked_CD =
        use_M_Store((state) => state.checked_CD?.[fieldname]) || [];
    const checked_CU =
        use_M_Store((state) => state.checked_CU?.[fieldname]) || [];

    const setChecked_CD = use_M_Store.getState().setChecked_CD;
    const setChecked_CU = use_M_Store.getState().setChecked_CU;
    const set_is_FOREIGN_changed =
        use_M_Store.getState().set_is_FOREIGN_changed;

    /**
     * checked_CD Hydration in case global state
     */
    useEffect(() => {
        const checked_CD_onRefresh =
            use_M_Store.getState().checked_CD?.[fieldname];
        /**
         * 1. Condition - not null
         * 2. Condition - has some date to update checked_CD
         * 3. Condition - update only on refresh
         */
        if (
            DB_options &&
            DB_options.length > 0 &&
            (!checked_CD_onRefresh || checked_CD_onRefresh.length === 0)
        ) {
            setChecked_CD(fieldname, DB_options);
        }

        /**
         * * we removed DB_options from dependency
         * * to avoid multiple set DB_options
         * * we need this data only on refresh
         */
    }, [fieldname]);

    /**
     * * setChecked_CD
     * * prepare_new_M_value_for_Update_CD
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_CD_Actions(option, event) {
        set_FOREIGN_Actions(event);
        /**
         * * from checked_CD  e.g. checkbox REQUIRED
         * * if     checked = add    REQUIRED
         * * if not checked = remove REQUIRED
         */
        const checked_CD_States = event.target.checked
            ? [...checked_CD, option]
            : checked_CD.filter((item) => item !== option);

        if (debug)
            console.log("[0] NBNBNBNBNBNB CD_Rule -- fieldname = ", fieldname);
        if (debug)
            console.log(
                "[1] NBNBNBNBNBNB CD_Rule -- checked_CD_States = ",
                checked_CD_States,
            );
        await setChecked_CD(fieldname, checked_CD_States);

        await validate_UI("CD", event);

        await update_M_value_for_checked_CD_CU();
    }

    /**
     * * save backup of seleted_D_FOREIGN and selected_U_FOREIGN for restore
     * * save only when checkbox FOREIGN is checked
     * @param {*} event
     */
    function set_FOREIGN_Actions(event) {
        const selected_D = use_M_Store.getState().selected_D;
        const selected_U = use_M_Store.getState().selected_U;
        if (event.target.value === "FOREIGN" && event.target.checked) {
            if (debug)
                console.log(
                    `[2] NBNBNBNBNBNB! CALLED --- set_FOREIGN_Actions (SAVE BACKUP)`,
                );
            if (debug)
                console.log(`[] NBNBNBNBNBNB! CALLED --- set_FOREIGN_Actions`);
            if (debug)
                console.log(
                    `[3] NBNBNBNBNBNB! CALLED --- set_FOREIGN_Actions -- fieldname = `,
                    fieldname,
                );
            if (debug)
                console.log(
                    `[4] NBNBNBNBNBNB! CALLED --- set_FOREIGN_Actions -- selected_D[${fieldname}] = `,
                    selected_D[fieldname],
                );
            if (debug)
                console.log(
                    `[5] NBNBNBNBNBNB! CALLED --- set_FOREIGN_Actions -- selected_U[${fieldname}] = `,
                    selected_U[fieldname],
                );
            set_selected_D_FOREIGN(fieldname, selected_D[fieldname]);
            set_selected_U_FOREIGN(fieldname, selected_U[fieldname]);
        }
    }

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => {
                const D_NAME = get_D_NAME(field_data);

                /** checked logic for showing DEFAULT_Panel */
                const is_show_DEFAULT_Panel =
                    D_NAME &&
                    option === "DEFAULT" &&
                    checked_CD.includes(option);

                return (
                    <div key={option} className="M_checkbox-item">
                        <label>
                            <input
                                type="checkbox"
                                value={option}
                                readOnly={!use_M_Store.getState().activeField} // is this really neccessary ?
                                checked={checked_CD.includes(option)}
                                onChange={(event) => {
                                    set_CD_Actions(option, event);
                                }}
                            />
                            {option}
                        </label>

                        {is_show_DEFAULT_Panel && (
                            <DEFAULT_Panel
                                D_NAME={D_NAME}
                                field_data={field_data}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
