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
    if (!field_data) return;
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
        console.log(
            " CD_Rule --- set_CD_Actions -- after validate_UI -- M_value = ",
            use_M_Store.getState().M_value,
        );
        await update_M_value_for_checked_CD_CU();
    }

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => {
                const D_NAME = get_D_NAME(field_data);

                // /** logic to correct checkbox DEFAULT UI to match JSON Backend */
                const last_selected_D =
                    use_M_Store.getState().selected_D_FOREIGN[fieldname];

                const is_last_D_Empty =
                    !last_selected_D || last_selected_D[fieldname] === "";

                if (fieldname === "image")
                    console.log(
                        `return LOOP CD_Rule ---- D_NAME = ${D_NAME}`,
                        `is_last_D_Empty = ${is_last_D_Empty}`,
                        `option = ${option}`,
                        `( option === "DEFAULT )" = ${option === "DEFAULT"}`,
                        `checked_CD.includes(${option}) = ${checked_CD.includes(option)}`,
                    );

                /** checked logic for showing DEFAULT_Panel */
                const is_show_DEFAULT_Panel =
                    D_NAME &&
                    is_last_D_Empty &&
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
                                    const selected_D =
                                        use_M_Store.getState().selected_D;
                                    if (
                                        event.target.value === "FOREIGN" &&
                                        selected_D[fieldname] != ""
                                    ) {
                                        console.log(
                                            `${event.target.value} CLICKED -- selected_D = `,
                                            selected_D,
                                        );
                                        console.log(
                                            `${event.target.value} CLICKED -- selected_D[${FIELDNAME}] = `,
                                            selected_D[FIELDNAME],
                                        );

                                        /**
                                         * * WE DON'T NEED THIS SHITTY SOLUTION FROM GEMINI
                                         * * selected_D is atomic state with deep structure
                                         * * (fieldname, D_NAME_or_D_Array) must use deep copy
                                         * * to get all children of it
                                         */
                                        // const deep_copied_selected_D =
                                        //     JSON.parse(
                                        //         JSON.stringify(
                                        //             use_M_Store.getState()
                                        //                 .selected_D,
                                        //         ),
                                        //     );

                                        use_M_Store
                                            .getState()
                                            .set_selected_D_FOREIGN(
                                                FIELDNAME,
                                                selected_D[FIELDNAME],
                                                // deep_copied_selected_D[
                                                //     FIELDNAME
                                                // ],
                                            );
                                    }
                                    set_CD_Actions(option, event);
                                }}
                            />
                            {option}
                        </label>

                        {is_show_DEFAULT_Panel && (
                            <DEFAULT_Panel
                                D_NAME={D_NAME}
                                field_data={
                                    use_M_Store.getState().M_value[FIELDNAME]
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
