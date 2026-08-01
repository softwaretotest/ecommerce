// resources/js/Components/0_M_EntityField.jsx
import { useState, useEffect } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { useError } from "@/Hooks/useError";
import {
    M_value_Service,
    update_M_value_with_selected_F_S,
} from "@/Services/0_M_value_Service";

import Field from "@/Components/0_M_Field.jsx";
import { render_All_F_S } from "@/Components/0_M_Entities_select";
import { setCursor } from "@/utils/setCursor";

/**
 * * DB Table with DB Column in it
 * * {
 * *     "_comment": "\/M_JSON\/Entities.json",
 * *  "entities": {
 * *         "t::ORDERS": [
 * *             "f::ORDER_NR",
 * *             "f::PRODUCT_ID",
 * *             "f::USER_ID",
 * *             "f::QUANTITY",
 * *             "f::CONFIRM_ORDER"
 * *         ],
 * *     }
 * * }
 */
export default function EntityField({ f_s_Class_Array, TABLENAME }) {
    const { handle_Fieldname_Change } = useError();
    const [TABLENAME_State, set_TABLENAME_State] = useState(TABLENAME);
    const selected_F_S = use_M_Store((state) => state.selected_F_S);
    const set_selected_F_S = use_M_Store.getState().set_selected_F_S;

    useEffect(() => {
        if (TABLENAME && f_s_Class_Array) {
            set_selected_F_S(TABLENAME, f_s_Class_Array);
        }
    }, [f_s_Class_Array, TABLENAME]);

    function delete_field() {
        console.log(`[EntityField] -- delete_field() called for ${TABLENAME}`);
    }

    function render_TABLENAME_State_and_DELETE_Button() {
        return (
            <div className="entities-M_value_KEY-and-delete-button">
                <input
                    type="text"
                    value={TABLENAME_State}
                    className="M_value_KEY"
                    onChange={async (event) => {
                        await handle_Fieldname_Change(
                            event.target.value,
                            set_TABLENAME_State,
                            {
                                UPDATE: true,
                            },
                        );
                        const activeField = use_M_Store.getState().activeField;
                        setCursor(activeField.toUpperCase().replace("T::", ""));
                    }}
                />
                <button className="delete-button" onClick={delete_field}>
                    DELETE
                </button>
            </div>
        );
    }

    function render_selected_F_S() {
        return (
            <div className="entities-selected-container">
                {Array.isArray(selected_F_S[TABLENAME]) &&
                selected_F_S[TABLENAME].length > 0 ? (
                    selected_F_S[TABLENAME].map((f_s_Class, index) => (
                        <div
                            key={index}
                            className="entities-selected-item"
                            onClick={() => {
                                // remove f::CLASS or s::CLASS from selected_F_S
                                use_M_Store
                                    .getState()
                                    .remove_F_S(TABLENAME, f_s_Class);
                                //save to backend
                                update_M_value_with_selected_F_S(TABLENAME);
                            }}
                        >
                            <span className="entities-icon">❌</span>
                            {f_s_Class.split("::")[1]}
                        </div>
                    ))
                ) : (
                    <div className="entities-label">
                        No fields selected yet.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="entities-wrapper-box">
            <div className="entities-container">
                {/* selected_F_S */}
                <div className="entities-seleted_F_S">
                    <label className="entities-label">
                        Table / Selected Fields
                    </label>
                    <div className="entities-left-column">
                        {render_TABLENAME_State_and_DELETE_Button()}
                        {render_selected_F_S()}
                    </div>
                </div>

                {/* f:: s:: all choices */}
                <div>
                    <label className="entities-label">
                        all existing fields to choose
                    </label>
                    {render_All_F_S(f_s_Class_Array, TABLENAME)}
                </div>
            </div>
        </div>
    );
}
