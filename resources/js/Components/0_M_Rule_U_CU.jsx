// resources/js/Components/0_M_Rule_U_CU.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";

import { update_M_value_for_checked_CD_CU } from "@/Components/0_M_Rules_M_value_Updater";
import { validate_UI } from "@/Components/0_M_Rules";

/**
 * Rule Fabric for onChange of CD Checkboxes (not done yet)
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} UI_options e.g. ["READONLY"] (selected options)
 * @param {*} ALL_UI_options e.g. ["READONLY", "DISABLED" , "REQUIRED"] (all allow options)
 */
export function CU_Rule({ UI_options, ALL_UI_options, field_data }) {
    const { activeSubTab } = use_M_Store();

    /**
     * field_data[] first element is fieldname
     */
    const fieldname = field_data[0];

    const FIELDNAME = fieldname.toUpperCase();

    const checked_CD =
        (use_M_Store.getState().checked_CD &&
            use_M_Store.getState().checked_CD[fieldname]) ||
        [];
    const checked_CU =
        (use_M_Store.getState().checked_CU &&
            use_M_Store.getState().checked_CU[fieldname]) ||
        [];
    const setChecked_CD = use_M_Store.getState().setChecked_CD;
    const setChecked_CU = use_M_Store.getState().setChecked_CU;

    useEffect(() => {
        setChecked_CU(fieldname, UI_options);
    }, [activeSubTab, fieldname]);

    /**
     * * setChecked_CU
     * * prepare_new_M_value_for_Update_CU
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_CU_Actions(option, event) {
        /**
         * * from checked_CU  e.g. checkbox REQUIRED
         * * if     checked = add    REQUIRED
         * * if not checked = remove REQUIRED
         */
        const checked_CU_States = event.target.checked
            ? [...checked_CU, option]
            : checked_CU.filter((item) => item !== option);

        // update UI
        await setChecked_CU(fieldname, checked_CU_States);

        await validate_UI("CU", event);
        await update_M_value_for_checked_CD_CU();
    }

    return (
        <div className="M_checkbox-list">
            {ALL_UI_options.map((option) => (
                <div key={option} className="M_checkbox-item">
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            readOnly={!use_M_Store.getState().activeField} // is this really neccessary ?
                            checked={checked_CU.includes(option)}
                            onChange={(event) => {
                                const selected_U =
                                    use_M_Store.getState().selected_U;
                                const set_selected_U_FOREIGN =
                                    use_M_Store.getState()
                                        .set_selected_U_FOREIGN;
                                if (
                                    checked_CD[fieldname]?.includes(
                                        "FOREIGN",
                                    ) &&
                                    selected_U[fieldname] != ""
                                ) {
                                    // console.log(
                                    //     `FOREIGN CLICKED -- selected_U = `,
                                    //     selected_U,
                                    // );
                                    // console.log(
                                    //     `FOREIGN CLICKED -- selected_U[${fieldname}] = `,
                                    //     selected_U[fieldname],
                                    // );

                                    set_selected_U_FOREIGN(
                                        FIELDNAME,
                                        selected_U[fieldname],
                                    );
                                }
                                set_CU_Actions(option, event);
                            }}
                        />
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
}
