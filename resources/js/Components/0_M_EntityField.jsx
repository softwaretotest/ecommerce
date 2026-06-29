// resources/js/Components/0_M_EntityField.jsx

import Field from "@/Components/0_M_Field.jsx";
import { M_Option, renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { use_M_Data } from "@/Services/0_M_DataProvider.jsx";

/**
 * DB Table with DB Column in it
 * e.g.
{
    "_comment": "1_Entities.json",
    "entities": {
        "t::orders": [
            "f::ORDER_NR",
            "f::PRODUCT_ID",
            "f::USER_ID",
            "f::QUANTITY",
            "f::CONFIRM_ORDER"
        ],
    }
}
*/
export default function EntityField({ field_data }) {
    const metadata = use_M_Data();
    const [tableName, ...fieldDataList] = field_data;

    // ฟังก์ชันดึง Options สำหรับ Dropdown
    function getOptions_for_Dropdown() {
        if (!metadata) return [];
        // ปรับตามโครงสร้าง M_Data ของคุณ
        const mData = metadata.m_data;
        // สมมติว่าต้องการดึงจากที่เก็บไว้ (เช่น ถ้าเป็นตาราง orders ก็ดึงจากตารางนั้น)
        const target = mData?.["f"] || {};
        return Object.keys(target).sort();
    }

    return (
        <div className="entity-wrapper-box">
            <div className="entity-header">
                <input
                    type="text"
                    defaultValue={tableName.replace("t::", "")}
                    className="App_Data_VALUE"
                    readOnly
                />
            </div>

            <div className="fields-container">
                <label>Fields for this DB Table</label>

                {/* วนลูปตามจำนวนฟิลด์ที่ได้รับมา */}
                {fieldDataList.map((fieldItem, index) => (
                    <div key={index} className="field-row">
                        <select defaultValue={fieldItem.replace("f::", "")}>
                            {getOptions_for_Dropdown().map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
