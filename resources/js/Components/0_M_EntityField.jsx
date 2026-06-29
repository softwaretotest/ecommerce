// resources/js/Components/0_M_EntityField.jsx

import Field from "@/Components/0_M_Field.jsx";
import { renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { use_M_Data } from "@/Providers/0_M_DataProvider.jsx";

/**
 * DB Table with DB Column in it
 * *
 * * {
 * *     "_comment": "1_Entities.json",
 * *  "entities": {
 * *         "t::orders": [
 * *             "f::ORDER_NR",
 * *             "f::PRODUCT_ID",
 * *             "f::USER_ID",
 * *             "f::QUANTITY",
 * *             "f::CONFIRM_ORDER"
 * *         ],
 * *     }
 * * }
 */
export default function EntityField({ field_data, table_name }) {
    console.log("0_M_EntityField.jsx - field_data = ", field_data);

    const metadata = use_M_Data();

    return (
        <div className="entity-wrapper-box">
            <div className="entity-header">
                <input
                    type="text"
                    defaultValue={table_name.replace("t::", "")}
                    className="App_Data_VALUE"
                    readOnly
                />
            </div>

            <div className="fields-container">
                <label>Fields for this DB Table</label>

                {field_data.map((fieldItem, index) => (
                    <div key={index} className="field-row">
                        {renderDropdown(
                            ["f"], // e.g. f::NAME, f::PRICE f::STOCK
                            [fieldItem],
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
