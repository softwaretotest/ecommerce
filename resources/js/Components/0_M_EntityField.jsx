// resources/js/Components/0_M_EntityField.jsx
import { useState } from "react";

import { useError } from "@/Hooks/useError";
import { M_value_Service } from "@/Services/0_M_value_Service";

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
    const { handle_Fieldname_Change } = useError();
    const [tablename, set_tablename] = useState(table_name);

    function render_tablename() {
        return (
            <input
                type="text"
                value={tablename}
                className="tablename"
                onChange={(event) =>
                    handle_Fieldname_Change(event.target.value, set_tablename, {
                        UPDATE: true,
                    })
                }
            />
        );
    }

    return (
        <div className="entities-wrapper-box">
            <div className="entities-container">
                {/* selected_F_S */}
                <div className="entities-seleted">
                    <label className="entities-label">
                        Table / Selected Fields
                    </label>
                    <div className="entities-left-column">
                        {render_tablename()}
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
                                        <span className="entities-icon">
                                            ❌
                                        </span>
                                        {f_s_Class.split("::")[1]}
                                    </div>
                                ))
                            ) : (
                                <div className="entities-label">
                                    No fields selected yet.
                                </div>
                            )}
                        </div>
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
