// resources/js/Components/0_M_EntityField.jsx
import { useState, useEffect } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { useError } from "@/Hooks/useError";
import { M_value_Service } from "@/Services/0_M_value_Service";

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
export default function EntityField({ f_s_Class_Array, tablename }) {
    const { handle_Fieldname_Change } = useError();
    const [TABLENAME_State, set_TABLENAME_State] = useState(tablename);
    const selected_F_S = use_M_Store((state) => state.selected_F_S);
    const set_selected_F_S = use_M_Store.getState().set_selected_F_S;

    useEffect(() => {
        if (tablename && f_s_Class_Array) {
            set_selected_F_S(tablename, f_s_Class_Array);
        }
    }, [f_s_Class_Array, tablename]);

    function render_TABLENAME_State() {
        return (
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
        );
    }

    // function render_selected_F_S() {
    //     return (
    //         <div className="entities-selected-container">
    //             {Array.isArray(f_s_Class_Array) &&
    //             f_s_Class_Array.length > 0 ? (
    //                 f_s_Class_Array.map((f_s_Class, index) => (
    //                     <div
    //                         key={index}
    //                         className="entities-selected-item"
    //                         onClick={() => {
    //                             // TODO : logic to remove back to all choices
    //                             console.log("Remove selected:", f_s_Class);
    //                         }}
    //                     >
    //                         <span className="entities-icon">❌</span>
    //                         {f_s_Class.split("::")[1]}
    //                     </div>
    //                 ))
    //             ) : (
    //                 <div className="entities-label">
    //                     No fields selected yet.
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }

    function render_selected_F_S() {
        return (
            <div className="entities-selected-container">
                {Array.isArray(selected_F_S[tablename]) &&
                selected_F_S[tablename].length > 0 ? (
                    selected_F_S[tablename].map((f_s_Class, index) => (
                        <div
                            key={index}
                            className="entities-selected-item"
                            onClick={() => {
                                // remove f::CLASS or s::CLASS from selected_F_S
                                use_M_Store
                                    .getState()
                                    .remove_F_S(tablename, f_s_Class);
                                console.log("Remove selected:", f_s_Class);
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
                <div className="entities-seleted">
                    <label className="entities-label">
                        Table / Selected Fields
                    </label>
                    <div className="entities-left-column">
                        {render_TABLENAME_State()}
                        {render_selected_F_S()}
                    </div>
                </div>

                {/* f:: s:: all choices */}
                <div>
                    <label className="entities-label">
                        all existing fields to choose
                    </label>
                    {render_All_F_S(f_s_Class_Array, tablename)}
                </div>
            </div>
        </div>
    );
}
