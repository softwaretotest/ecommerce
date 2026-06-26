// 0_M_Rule_UI.jsx
import { useState } from "react";

/**
 * make checkboxes for UI rules (READONLY, DISABLED, etc.)
 * @param {*} UI_options e.g. ["READONLY"] (สิ่งที่ถูกเลือกจาก DB)
 * @param {*} ALL_UI_options e.g. ["READONLY", "DISABLED", ...] (ตัวเลือกทั้งหมดของ UI)
 */
export function UI_Rule({ UI_options, ALL_UI_options }) {
    const [checkedItems, setCheckedItems] = useState(UI_options);

    function updateUIRules(currentItems, option, isChecked) {
        let nextItems = isChecked
            ? [...currentItems, option]
            : currentItems.filter((item) => item !== option);

        // ใส่กฎของ UI ตรงนี้ (ตัวอย่าง: ถ้า DISABLED แล้วห้าม READONLY)
        if (option === "DISABLED" && isChecked) {
            nextItems = nextItems.filter((i) => i !== "READONLY");
        }
        if (option === "READONLY" && isChecked) {
            nextItems = nextItems.filter((i) => i !== "DISABLED");
        }

        return nextItems;
    }

    return (
        <div className="M_checkbox-list">
            {ALL_UI_options.map((option) => (
                <label key={option}>
                    <input
                        type="checkbox"
                        value={option}
                        checked={checkedItems.includes(option)}
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            const nextState = updateUIRules(
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
