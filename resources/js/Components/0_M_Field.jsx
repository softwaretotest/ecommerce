// resources/js/Components/0_M_Field.jsx
import { useState } from "react";

import { renderDropdown_D } from "@/Components/0_M_Dropdown_D";
import { renderDropdown_U } from "@/Components/0_M_Dropdown_U";
import { renderCheckboxList } from "@/Components/0_M_CheckBox";

import { use_M_Option } from "@/Hooks/use_M_Option";
import { useError } from "@/Hooks/useError";

import { M_value_Service, delete_field } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";

export default function Field({ field_data }) {
    const fieldname = field_data[0];
    const is_CURRENCY = field_data[0].toLowerCase() === "currency";

    const [FIELDNAME, set_FIELDNAME] = useState(fieldname);

    const { handle_Fieldname_Change } = useError();
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

    function render_fieldname_input(fieldname, className, disabled = false) {
        return (
            <div className="field-input-group">
                <a>{className}</a>
                <input
                    type="text"
                    value={
                        disabled
                            ? FIELDNAME.toLowerCase()
                            : FIELDNAME.toUpperCase()
                    }
                    className={className}
                    disabled={disabled}
                    onChange={(event) =>
                        handle_Fieldname_Change(
                            event.target.value,
                            set_FIELDNAME,
                            { UPDATE: true },
                        )
                    }
                />
            </div>
        );
    }

    return (
        <div className="field-wrapper-box">
            <div className="field-header-container">
                {render_fieldname_input(fieldname.toUpperCase(), "M_value_KEY")}

                <span className="field-separator-colon">:</span>

                {render_fieldname_input(fieldname, "fieldname", true)}

                <button
                    className="delete-button"
                    onClick={() => {
                        delete_field(fieldname);
                    }}
                >
                    DELETE
                </button>
            </div>
            {CHECKBOX_and_DROPDOWN}
        </div>
    );
}
