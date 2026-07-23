// resources/js/Components/0_M_Entities_select.jsx
import React, { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";

/**
 * * Renders F and S choices/selected items for Entities
 * @param {Array} f_s_Class_Array - Current table's assigned fields (e.g., ['f::ORDER_NR', ...])
 * @param {String} f_s_Class_Name - Specific field name or item being evaluated
 */
export function render_F_S_select(f_s_Class_Array, f_s_Class_Name) {
    const M_value = use_M_Store((state) => state.M_value);

    let all_choices = [];

    if (M_value) {
        Object.entries(M_value).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    all_choices.push(item);
                });
            }
        });
    }

    // state สำหรับเก็บข้อความค้นหาใน Search Box
    const [searchTerm, setSearchTerm] = useState("");

    // กรองข้อมูลตามคำค้นหา (Custom Search Logic แบบบ้านๆ แต่ทรงพลัง)
    const filteredChoices = f_s_Class_Array
        ? f_s_Class_Array.filter((choice) =>
              String(choice).toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : [];

    return (
        <div className="entity-select-container">
            {/* 1. Search Box ด้านบน */}
            <div className="entity-search-box-wrapper">
                <input
                    type="text"
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="entity-search-input"
                />
            </div>

            {/* 2. กล่องแสดงรายการตัวเลือกแบบถาวร พร้อมจำกัดความสูงและใส่ Scrollbar */}
            <div className="choices-list-box">
                {filteredChoices.length > 0 ? (
                    filteredChoices.map((choice, idx) => (
                        <div
                            key={idx}
                            className="choice-item"
                            onClick={() => {
                                // เดี๋ยวเรามาเขียน Logic กดเลือก / ย้ายฝั่ง ตรงนี้ในสเต็ปถัดไป
                                console.log("Selected:", choice);
                            }}
                        >
                            {choice}
                        </div>
                    ))
                ) : (
                    <div className="no-choice">
                        Please, insert a new field in APP_DATA
                    </div>
                )}
            </div>
        </div>
    );
}
