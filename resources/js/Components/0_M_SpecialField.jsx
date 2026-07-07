// resources/js/Components/0_M_SpecialField.jsx
import React from "react";
import Field from "@/Components/0_M_Field.jsx";

// ปรับให้รับ field_data และ m_data_all เหมือนกับ Field
export default function SpecialField({ field_data, M_value, activeSubTab }) {
    // ในอนาคตถ้ามี Logic พิเศษสำหรับ SpecialField ให้เขียนไว้ตรงนี้
    // เช่น: if (field_data[0] === 'some_special_key') { return <OtherComponent /> }

    return <Field field_data={field_data} />;
}
