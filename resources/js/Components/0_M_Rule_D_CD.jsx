// resources/js/Components/0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";

import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";
import { prepare_new_M_value_for_Update_CD } from "@/Components/0_M_value_Updater_CD";
import { Focus_CD_Rule_onChange } from "@/Components/0_M_Focus_CD_Rule_onChange";

/**
 * Rule Fabric for onChange of CD Checkboxes (not done yet)
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (selected options)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (all allow options)
 */
export function CD_Rule({ DB_options, ALL_DB_options, field_data }) {
    // console.log("Rule_D_CD.jsx - DB_options = ", DB_options);
    const [checked_CD, setChecked_CD] = useState(DB_options);

    const setJSON_Content_State = use_M_Store(
        (state) => state.setJSON_Content_State,
    );

    const {
        M_value,
        set_M_value,
        activeField,
        setActiveField,
        activeTab,
        activeSubTab,
        setActiveSubTab,
    } = use_M_Store();

    /**
     * field_data[] first element is fieldname
     */
    const fieldname = field_data[0];

    const fieldname_UPPERCASE = fieldname.toUpperCase();

    /**
     * * setChecked_CD
     * * prepare_new_M_value_for_Update_CD
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_CD_Actions(option, event) {
        // calculate new State
        const checked_CD_States = event.target.checked
            ? [...checked_CD, option]
            : checked_CD.filter((item) => item !== option);

        // update UI
        setChecked_CD(checked_CD_States);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update_CD(
            M_value,
            fieldname,
            checked_CD_States,
        );

        await M_value_Service.update(new_M_value);
    }

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => (
                // console.log("Rule_D_CD.jsx - checked_CD = ", checked_CD),
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
                    {/* show or hide when user click on checkbox */}
                    {/* MUCH MORE STRICT CONDITIONS, COULD PREVENT ERRORS */}
                    {/* {((activeTab === "app_data" && activeSubTab === "f") ||
                        (activeTab === "m_data" && activeSubTab === "s")) &&
                        checked_CD.includes("DEFAULT") &&
                        option === "DEFAULT" && (
                            <DEFAULT_Panel field_data={field_data} />
                        )} */}

                    {checked_CD.includes("DEFAULT") && option === "DEFAULT" && (
                        <DEFAULT_Panel field_data={field_data} />
                    )}
                </div>
            ))}
        </div>
    );
}
