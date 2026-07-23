// resources/js/Components/0_M_Entities_select.jsx
import React, { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";
import { get_all_fieldnames } from "@/Providers/0_M_DataProvider";

/**
 * * Renders F and S choices/selected items for Entities
 * @param {Array} f_s_Class_Array - Current table's assigned fields (e.g., ['f::ORDER_NR', ...])
 * @param {String} f_s_Class_Name - Specific field name or item being evaluated
 */
export function render_F_S_select(f_s_Class_Array) {
    console.log(
        "!!!!!!!!!!!!! 0_M_Entities_select -- render_F_S_select -- f_s_Class_Array = ",
        f_s_Class_Array,
    );
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

    // กรองข้อมูลตามคำค้นหา (Custom Search Logic แบบบ้านๆ แต่ทรงพลัง)
    const all_f_s_choices = get_all_fieldnames();

    // กรองข้อมูลทั้งหมดตามคำค้นหาที่พิมพ์ใน Search Box
    const filtered_all_choices = all_f_s_choices.filter((choice) =>
        String(choice).toUpperCase().includes(searchTerm),
    );

    return (
        <div className="entity-select-container">
            {/* 1. Search Box ด้านบน */}
            <div className="entity-search-box-wrapper">
                <input
                    className="entity-search-input"
                    type="text"
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value.toUpperCase())
                    }
                />
            </div>

            {/* 2. กล่องแสดงรายการตัวเลือกแบบถาวร พร้อมจำกัดความสูงและใส่ Scrollbar */}
            <div className="entities-choices-list-box">
                {filtered_all_choices.length > 0 ? (
                    filtered_all_choices.map((choice, idx) => (
                        <div
                            key={idx}
                            className="entities-choice-item"
                            onClick={() => {
                                // TODO : logic to add to selected_F_S
                                console.log("Selected:", choice);
                            }}
                        >
                            {choice}
                        </div>
                    ))
                ) : (
                    <div className="entities-no-choice">
                        {searchTerm} NOT FOUND !!! <br />
                        Please, insert a new field in APP_DATA
                    </div>
                )}
            </div>
        </div>
    );
}
