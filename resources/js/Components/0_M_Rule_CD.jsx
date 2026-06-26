// 0_M_Rule_CD.jsx
import { useState } from "react";

/**
 * make checkboxes for cd and insert rule in onChange
 * @param {*} DB_options e.g. ["REQUIRED"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_DB_options e.g. ["NULLABLE", "PRIMARY", ...] (ตัวเลือกทั้งหมดที่อนุญาต)
 */
export function CD_Rule({ DB_options, ALL_DB_options }) {
    const [checkedItems, setCheckedItems] = useState(DB_options);

    function updateRules(currentItems, option, isChecked) {
        let nextItems = isChecked
            ? [...currentItems, option]
            : currentItems.filter((item) => item !== option);

        if (option === "PRIMARY" && isChecked) {
            nextItems = nextItems.filter(
                (i) => !["FOREIGN", "UNIQUE", "NULLABLE"].includes(i),
            );
        }
        if (option === "REQUIRED" && isChecked) {
            nextItems = nextItems.filter((i) => i !== "NULLABLE");
        }
        if (option === "NULLABLE" && isChecked) {
            nextItems = nextItems.filter(
                (i) => !["PRIMARY", "REQUIRED"].includes(i),
            );
        }

        return nextItems;
    }

    return (
        <div className="M_checkbox-list">
            {ALL_DB_options.map((option) => (
                <label key={option}>
                    <input
                        type="checkbox"
                        value={option}
                        // ตรวจสอบจาก checkedItems ว่าอยู่ในลิสต์ที่ถูกเลือกไหม
                        checked={checkedItems.includes(option)}
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            const nextState = updateRules(
                                checkedItems,
                                option,
                                isChecked,
                            );
                            setCheckedItems(nextState);
                        }}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
}
