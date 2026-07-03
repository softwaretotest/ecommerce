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
    M_value: prop_M_value, // เปลี่ยนชื่อนิดหน่อยเพื่อกันงง
    activeSubTab,
}) {
    const fieldname = field_data[0];
    const activeTab = use_M_Store((state) => state.activeTab);

    // ใช้การอ่านค่าจาก M_value ที่ส่งมาเป็น Props ในการกำหนดค่าเริ่มแรก (Initial)
    const M_value = use_M_Store((state) => state.M_value);
    const set_M_value = use_M_Store((state) => state.set_M_value);
    const initialChecked = M_value[fieldname] || DB_options || [];

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => (
                <div key={option} className="M_checkbox-item">
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            defaultChecked={initialChecked.includes(option)}
                            onChange={(event) => {
                                // เราเรียกอัปเดต Store
                                update_M_value(event, field_data, M_value);

                                // และสั่งให้ Logic อื่นทำงาน
                                Focus_CD_Rule_onChange({
                                    element_DOM: event.target,
                                    M_value,
                                    field_data,
                                });
                            }}
                        />
                        {option}
                    </label>
                    {/* ... ส่วนของ DEFAULT_Panel ... */}
                    {(activeTab === "app_data" ||
                        (activeTab === "m_data" && activeSubTab === "s")) &&
                        initialChecked.includes("DEFAULT") &&
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
