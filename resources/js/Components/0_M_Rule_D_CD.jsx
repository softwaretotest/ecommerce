// 0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";

import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";
import { prepare_new_M_value_for_Update } from "@/Components/0_M_value_Updater";
import { Focus_CD_Rule_onChange } from "@/Components/0_M_Focus_CD_Rule_onChange";

import JSON_Content from "./0_M_JSON_Content";
/**
 * Rule Fabric
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (ตัวเลือกทั้งหมดที่อนุญาต)
 */
export function CD_Rule({ DB_options, ALL_DB_options, field_data }) {
    // console.log("Rule_D_CD.jsx - DB_options = ", DB_options);
    const [checked_CD, setChecked_CD] = useState(DB_options);

    const setJSON_Content_State = use_M_Store(
        (state) => state.setJSON_Content_State,
    );

    const {
        setFocus,
        M_value,
        set_M_value,
        activeField,
        setActiveField,
        activeTab,
        activeSubTab,
        setActiveSubTab,
    } = use_M_Store();

    /**
     * Assuming field_data is an array and the first element is the field name
     */
    const fieldname = field_data[0];

    // console.log(" CD_Rule - fieldname = ", fieldname);
    const fieldname_UPPERCASE = fieldname.toUpperCase();
    // console.log(
    //     " CD_Rule - M_value[fieldname_UPPERCASE] = ",
    //     M_value[fieldname_UPPERCASE],
    // );

    /**
     * * setChecked_CD
     * * prepare_new_M_value_for_Update
     * * set_M_value
     * * update JSON
     */
    async function set_D_CD_Actions(option, event) {
        // calculate new State
        const checked_CD_States = event.target.checked
            ? [...checked_CD, option]
            : checked_CD.filter((item) => item !== option);

        // update UI
        setChecked_CD(checked_CD_States);

        // prepare new data
        const new_M_value = prepare_new_M_value_for_Update(
            M_value,
            fieldname,
            checked_CD_States,
        );

        //update M_Store
        set_M_value(new_M_value);

        // update JSON
        await M_value_Service.update(new_M_value);

        setJSON_Content_State(
            <JSON_Content
                M_value={new_M_value}
                activeField={activeField}
                setActiveField={setActiveField}
            />,
        );
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
                            ////------- this does not work
                            // If 'option' is in 'checked_CD' array, the box is checked.
                            // checked={M_value[fieldname_UPPERCASE].includes(
                            //     option,
                            // )}

                            /**
                             * !!!! react state on checked ,
                             * always need onChange to update state !!!
                             */
                            checked={checked_CD.includes(option)}
                            onChange={(event) => {
                                setFocus(fieldname, M_value);
                                set_D_CD_Actions(option, event);
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
