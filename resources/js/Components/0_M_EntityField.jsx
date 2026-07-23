// resources/js/Components/0_M_EntityField.jsx

import Field from "@/Components/0_M_Field.jsx";
import { render_F_S_select } from "@/Components/0_M_Entities_select";

/**
 * * DB Table with DB Column in it
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
export default function EntityField({ f_s_Class_Array, table_name }) {
    /**
     * * React render to much in the beginning
     * * later params are correct not error in ui
     */
    if (!Array.isArray(f_s_Class_Array)) return;

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

            <label>Fields for this DB Table</label>
            <div className="fields-container">
                {/* selected_F_S */}
                {f_s_Class_Array.map((f_s_Class_Name, index) => (
                    <div key={index} className="field-row">
                        {render_F_S_select(f_s_Class_Array, f_s_Class_Name)}
                    </div>
                ))}

                {/* f:: s:: all choices */}
                {f_s_Class_Array.map((f_s_Class_Name, index) => (
                    <div key={index} className="field-row">
                        {render_F_S_select(f_s_Class_Array, f_s_Class_Name)}
                    </div>
                ))}
            </div>
        </div>
    );
}
