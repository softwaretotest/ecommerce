// 0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";
import { prepare_new_M_value_for_Update } from "@/Components/0_M_value_Updater";

/**
 * Rule Fabric
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (ตัวเลือกทั้งหมดที่อนุญาต)
 */
export function CD_Rule({ DB_options, ALL_DB_options, field_data, M_value }) {
    // console.log("Rule_D_CD.jsx - DB_options = ", DB_options);
    const [checked_CD, setChecked_CD] = useState(DB_options);

    const setFocus = use_M_Store((state) => state.setFocus);
    const set_M_value = use_M_Store((state) => state.set_M_value);

    const fieldname = field_data[0]; // Assuming field_data is an array and the first element is the field name

    const [INDEX, set_INDEX] = useState(false);
    const [UNIQUE, set_UNIQUE] = useState(false);
    const [DEFAULT, set_DEFAULT] = useState(null);
    const [FOREIGN, set_FOREIGN] = useState(false);
    const [NULLABLE, set_NULLABLE] = useState(false);
    const [REQUIRED, set_REQUIRED] = useState(false);

    function get_CD_State(option, states) {
        switch (option) {
            case "DEFAULT":
                return states.DEFAULT;
            case "REQUIRED":
                return states.REQUIRED;
            case "UNIQUE":
                return states.UNIQUE;
            case "NULLABLE":
                return states.NULLABLE;
            default:
                return false;
        }
    }

    // useEffect(() => {
    //     console.log("Rule_D_CD.jsx - checked_CD = ", checked_CD);
    // }, [checked_CD]);

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
                            // If 'option' is in 'checked_CD' array, the box is checked.
                            checked={checked_CD.includes(option)}
                            onChange={(e) => {
                                // // set checked -----------------------
                                const checked_CD_States = e.target.checked
                                    ? [...checked_CD, option]
                                    : checked_CD.filter(
                                          (item) => item !== option,
                                      );
                                setChecked_CD(checked_CD_States);

                                // set Focus in M_Store -----------------------

                                const new_M_Value =
                                    prepare_new_M_value_for_Update(
                                        M_value,
                                        fieldname,
                                        checked_CD_States,
                                    );
                                set_M_value(new_M_Value);
                            }}
                        />
                        {option}
                    </label>

                    {option === "DEFAULT" && checked_CD.includes("DEFAULT") && (
                        <DEFAULT_Panel field_data={field_data} />
                    )}
                </div>
            ))}
        </div>
    );
}
