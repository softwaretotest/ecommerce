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

            <div className="entities-sfields-container">
                {/* selected_F_S */}
                <div className="entities-seleted">
                    <label className="entities-label">
                        Selected Fields for this Table
                    </label>

                    <div className="entities-selected-container">
                        {Array.isArray(f_s_Class_Array) &&
                        f_s_Class_Array.length > 0 ? (
                            f_s_Class_Array.map((f_s_Class, index) => (
                                <div
                                    key={index}
                                    className="entities-selected-item"
                                    onClick={() => {
                                        // TODO : logic to remove back to all choices
                                        console.log(
                                            "Remove selected:",
                                            f_s_Class,
                                        );
                                    }}
                                >
                                    <span className="entities-icon">❌</span>
                                    <span>{f_s_Class.split("::")[1]}</span>
                                </div>
                            ))
                        ) : (
                            <div className="entities-label">
                                No fields selected yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* f:: s:: all choices */}
                <div>
                    <label className="entities-label">
                        all existing fields to choose
                    </label>
                    {render_F_S_select(f_s_Class_Array)}
                </div>
            </div>
        </div>
    );
}
