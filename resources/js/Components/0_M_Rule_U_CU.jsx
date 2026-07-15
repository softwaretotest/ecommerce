// resources/js/Components/0_M_Rule_D_CU.jsx
import { useState } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";

import { prepare_new_M_value_for_Update_CU } from "@/Components/0_M_value_Updater_CU";

/**
 * Rule Fabric for onChange of CD Checkboxes (not done yet)
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} UI_options e.g. ["READONLY"] (selected options)
 * @param {*} ALL_UI_options e.g. ["READONLY", "DISABLED" , "REQUIRED"] (all allow options)
 */
export function CU_Rule({ UI_options, ALL_UI_options, field_data }) {
    const [checked_CU, setChecked_CU] = useState(UI_options);

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
     * * setChecked_CU
     * * prepare_new_M_value_for_Update_CU
     * * set_M_value
     * * update JSON file (App-Data.json , M-Data.json , Entities.json)
     * * update JSON View (JSON_Content.jsx)
     */
    async function set_CU_Actions(option, event) {
        // calculate new State
        const checked_CU_States = event.target.checked
            ? [...checked_CU, option]
            : checked_CU.filter((item) => item !== option);

        // update UI
        setChecked_CU(checked_CU_States);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update_CU(
            M_value,
            fieldname,
            checked_CU_States,
        );

        await M_value_Service.update(new_M_value);
    }

    return (
        <div className="M_checkbox-list">
            {ALL_UI_options.map((option) => (
                <div key={option} className="M_checkbox-item">
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            /**
                             * !!!! react state on checked ,
                             * always need onChange to update state !!!
                             */
                            checked={checked_CU.includes(option)}
                            onChange={(event) => {
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
