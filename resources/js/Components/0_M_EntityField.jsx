// resources/js/Components/0_M_EntityField.jsx

import Field from "@/Components/0_M_Field.jsx";
import { renderDropdown_for_entities } from "@/Components/0_M_Dropdown_for_Entities";

/**
 * DB Table with DB Column in it
 * *
 * * {
 * *     "_comment": "\/M_JSON\/Entities.json",
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
                        {renderDropdown_for_entities(
                            ["f", "s"], // e.g. f::NAME, f::PRICE, f::STOCK, s::EMAIL
                            [fieldItem],
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
