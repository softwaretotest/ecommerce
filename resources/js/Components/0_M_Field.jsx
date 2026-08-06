// resources/js/Components/0_M_Field.jsx
import { useState, useEffect } from "react";

import { use_M_Option } from "@/Hooks/use_M_Option";

import { use_M_Store } from "@/Stores/0_M_Store";

import { M_value_Service, delete_field } from "@/Services/0_M_value_Service";

import { renderDropdown_D } from "@/Components/0_M_Dropdown_D";
import { renderDropdown_U } from "@/Components/0_M_Dropdown_U";
import { renderCheckboxList } from "@/Components/0_M_CheckBox";
import { render_fieldname_input } from "@/Components/0_M_Input_Group.jsx";

export default function Field({ field_data }) {
    const fieldname = field_data[0];
    const is_CURRENCY = field_data[0].toLowerCase() === "currency";

    // const [FIELDNAME_to_update, set_FIELDNAME_to_update] = useState(fieldname);
    const { FIELDNAME_to_update, set_FIELDNAME_to_update } = use_M_Store();

    /**
     * useEffect to set input.M_value_KEY in APP DATA
     */
    useEffect(() => {
        set_FIELDNAME_to_update(fieldname, fieldname);
    }, [field_data]);

    /**
     * State to open / close Backdrop (lock UI during editig)
     */
    const { is_Editing, set_is_Editing } = use_M_Store();

    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store.getState().setActiveField;

    function make_dropdown_D(label, names) {
        return (
            <div className="field-column">
                <div className="field-label">{label}</div>
                {renderDropdown_D(names, field_data)}
            </div>
        );
    }

    function make_dropdown_U(label, names) {
        return (
            <div className="field-column">
                <div className="field-label">{label}</div>
                {renderDropdown_U(names, field_data)}
            </div>
        );
    }

    function make_checkbox(label, names) {
        return (
            <div className="field-column">
                <div className="field-label">{label}</div>
                {renderCheckboxList(names, label, field_data)}
            </div>
        );
    }

    /**
     * * for now to make M_Project_UI works
     * * we prevent user from edit CURRENCY field
     * * xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     * * TODO: move s::CURRENCY to bm::CURRENCY (Behavior + Modifier)
     * * which is neither DB nor UI property ,
     * * bm::CLASS will have separate logic e.g. function validata currency
     */
    const CHECKBOX_and_DROPDOWN = !is_CURRENCY && (
        <div className="field-dropdown-grid">
            {make_dropdown_D("D", ["d"])}
            {make_checkbox("CD", ["cd", "cud"])}
            {make_dropdown_U("U", ["u"])}
            {make_checkbox("CU", ["cu", "cud"])}
        </div>
    );

    return (
        // <div className="field-wrapper-box">
        <>
            <div className="field-header-container">
                {render_fieldname_input(fieldname, "M_value_KEY")}

                <span className="field-separator-colon">:</span>

                {render_fieldname_input(fieldname, "fieldname")}

                <button
                    className="delete-button"
                    onClick={() => {
                        delete_field(fieldname);
                        set_is_Editing(false);
                    }}
                >
                    DELETE
                </button>
            </div>
            {CHECKBOX_and_DROPDOWN}
        </>
        // </div>
    );
}
