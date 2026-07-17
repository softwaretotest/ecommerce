// resources/js/Components/0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { update_M_value_for_checked_CD_CU } from "@/Components/0_M_Rules_M_value_Updater";
import { validate_UI } from "@/Components/0_M_Rules";

import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";
/**
 * Rule Fabric for onChange of CD Checkboxes (not done yet)
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (selected options)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (all allow options)
 */
export function CD_Rule({ DB_options, ALL_DB_options, field_data }) {
    // if (!field_data) return;
    const { activeSubTab } = use_M_Store();

    /**
     * field_data[] first element is fieldname
     */
    const fieldname = field_data[0];

    const fieldname_UPPERCASE = fieldname.toUpperCase();

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
        setChecked_CD(fieldname, DB_options);
    }, [activeSubTab, fieldname]);

    /**
     * * setChecked_CD
     * * prepare_new_M_value_for_Update_CD
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_CD_Actions(option, event) {
        /**
         * * from checked_CD  e.g. checkbox REQUIRED
         * * if     checked = add    REQUIRED
         * * if not checked = remove REQUIRED
         */
        const checked_CD_States = event.target.checked
            ? [...checked_CD, option]
            : checked_CD.filter((item) => item !== option);

        await setChecked_CD(fieldname, checked_CD_States);

        await validate_UI("CD", event);

        update_M_value_for_checked_CD_CU();
    }
    // const currentFieldChecked = use_M_Store(
    //     (state) => state.checked_CD[field_data[0]] || [],
    // );
    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => (
                <div key={option} className="M_checkbox-item">
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            /**
                             * !!!! react state on checked ,
                             * always need onChange to update state !!!
                             */
                            checked={checked_CD.includes(option)}
                            onChange={(event) => {
                                set_CD_Actions(option, event);
                            }}
                        />
                        {option}
                    </label>
                    {/* {option === "DEFAULT" && (
                        <p>currentFieldChecked = {currentFieldChecked}</p>
                    )} */}
                    {/* {currentFieldChecked.includes("DEFAULT") && */}
                    {checked_CD.includes("DEFAULT") && option === "DEFAULT" && (
                        <DEFAULT_Panel field_data={field_data} />
                    )}
                </div>
            ))}
        </div>
    );
}
