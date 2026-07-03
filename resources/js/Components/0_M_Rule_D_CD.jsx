// 0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";
import { DEFAULT_Panel } from "@/Components/0_M_DEFAULT_Panel";
import { prepare_new_M_value_for_Update } from "@/Components/0_M_value_Updater";
import { Focus_CD_Rule_onChange } from "@/Components/0_M_Focus_CD_Rule_onChange";

/**
 * Rule Fabric
 * to make UI e.g. checkboxes inputs
 * for cd and insert rule in onChange onClick etc.
 * @param {*} DB_options e.g. ["REQUIRED"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (ตัวเลือกทั้งหมดที่อนุญาต)
 */
export function CD_Rule({
    DB_options,
    ALL_DB_options,
    field_data,
    // M_value,
    activeSubTab,
}) {
    // console.log("Rule_D_CD.jsx - DB_options = ", DB_options);
    const [checked_CD, setChecked_CD] = useState(DB_options);

    const setFocus = use_M_Store((state) => state.setFocus);
    const activeTab = use_M_Store((state) => state.activeTab);
    const M_value = use_M_Store((state) => state.M_value);
    const set_M_value = use_M_Store((state) => state.set_M_value);
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
     */
    function set_D_CD_Actions(option, event) {
        const checked_CD_States = event.target.checked
            ? [...checked_CD, option]
            : checked_CD.filter((item) => item !== option);

        setChecked_CD(checked_CD_States);

        const new_M_Value = prepare_new_M_value_for_Update(
            M_value,
            fieldname,
            checked_CD_States,
        );
        set_M_value(new_M_Value);
    }

    // const M_value_to_Log = use_M_Store((state) => state.M_value);
    // useEffect(() => {
    //     console.log("Rule_D_CD.jsx - M_value_to_Log = ", M_value_to_Log);
    // }, [M_value_to_Log]);

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
                                console.log(" checked_CD = ", checked_CD);
                                console.log(" option = ", option);

                                update_M_value(event, field_data, M_value);
                                Focus_CD_Rule_onChange({
                                    element_DOM: event.target,
                                    M_value,
                                    field_data,
                                });
                                set_D_CD_Actions(option, event);

                                // const hasOption =
                                //     M_value[fieldname_UPPERCASE].includes(
                                //         option,
                                //     );

                                // console.log(" hasOption = ", hasOption);
                                // console.log(" option = ", option);
                                // if (!hasOption) {
                                //     const new_M_value = { ...M_value };
                                //     const cd_Class =
                                //         "cd::" + option.toUpperCase();
                                //     console.log(" cd_Class = ", cd_Class);
                                //     new_M_value[fieldname_UPPERCASE].push(
                                //         cd_Class,
                                //     );
                                //     set_D_CD_Actions(option, event);
                                // const new_M_Value =
                                //     prepare_new_M_value_for_Update(
                                //         M_value,
                                //         fieldname,
                                //         checked_CD_States,
                                //     );
                                // set_M_value(new_M_value);
                                // }
                            }}
                        />
                        {option}
                    </label>
                    {/* show or hide when user click on checkbox */}
                    {(activeTab === "app_data" ||
                        (activeTab === "m_data" && activeSubTab === "s")) &&
                        checked_CD.includes("DEFAULT") &&
                        option === "DEFAULT" && (
                            <DEFAULT_Panel field_data={field_data} />
                        )}
                </div>
            ))}
        </div>
    );
}

function update_M_value(event, field_data, M_value) {
    const fieldname = field_data[0];
    const checked_CD_States = Array.from(
        event.target
            .closest(".M_checkbox-list")
            .querySelectorAll("input:checked"),
    ).map((input) => input.value);

    const new_M_Value = prepare_new_M_value_for_Update(
        M_value,
        fieldname,
        checked_CD_States,
    );

    use_M_Store.getState().set_M_value(new_M_Value);
}
