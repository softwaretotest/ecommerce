// 0_M_Rule_D_CD.jsx
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { use_M_Store } from "@/Stores/0_M_Store";

/**
 * make checkboxes for cd and insert rule in onChange
 * @param {*} DB_options e.g. ["REQUIRED"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (ตัวเลือกทั้งหมดที่อนุญาต)
 */
export function CD_Rule({ DB_options, ALL_DB_options }) {
    console.log("0_M_Rule_D_CD.jsx - Rendering with DB_options:", DB_options);

    const [checked_CD, setChecked_CD] = useState(DB_options);

    const D_States = use_M_Store(useShallow((state) => state.D_States));
    const CD_States = use_M_Store(useShallow((state) => state.CD_States));

    /**
     * test bug 23 - 24 lines , when click field e.g. name , stock
     * this bug is not critical but should be solved
     */
    // useEffect(() => {
    //     console.log("0_M_Rule_D_CD.js - D_States = ", D_States);
    //     console.log("0_M_Rule_D_CD.js - CD_States = ", CD_States);
    // }, [D_States, CD_States]);

    function updateRules(currentItems, option, isChecked) {
        // Logic to auto. contraint UI
    }

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => (
                <label key={option}>
                    <input
                        type="checkbox"
                        value={option}
                        // ตรวจสอบจาก checked_CD ว่าอยู่ในลิสต์ที่ถูกเลือกไหม
                        checked={checked_CD.includes(option)}
                        onChange={(e) => {
                            //call rule function
                        }}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
}
