// resources/js/Components/0_M_Field.jsx
import { useState, useEffect } from "react";

import { use_M_Option } from "@/Hooks/use_M_Option";
import { useError } from "@/Hooks/useError";

import { use_M_Store } from "@/Stores/0_M_Store";

import {
    M_value_Service,
    delete_field,
    rename_M_value_KEY_and_fieldname,
} from "@/Services/0_M_value_Service";

import { renderDropdown_D } from "@/Components/0_M_Dropdown_D";
import { renderDropdown_U } from "@/Components/0_M_Dropdown_U";
import { renderCheckboxList } from "@/Components/0_M_CheckBox";

export default function Field({ field_data }) {
    const fieldname = field_data[0];
    const is_CURRENCY = field_data[0].toLowerCase() === "currency";

    const [FIELDNAME, set_FIELDNAME] = useState(fieldname);

    /**
     * State to open / close Backdrop (lock UI during editig)
     */
    const { is_Editing, set_is_Editing } = use_M_Store();

    const { Error_FIELDNAME, handle_Fieldname_Change } = useError();
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

    // ในคอมโพเนนต์ของคุณ (เช่น หน้า Dashboard หรือ Layout หลักที่มี Backdrop)
    // const { is_Editing } = use_M_Store();

    useEffect(() => {
        if (is_Editing) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // Cleanup function ป้องกันค้างเวลาคอมโพเนนต์ถูก unmount
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [is_Editing]);

    function render_fieldname_input(fieldname, className, disabled = false) {
        const show_CRUD_BTN =
            className === "M_value_KEY" &&
            fieldname.toLowerCase() === activeField;

        const className_activeField =
            fieldname.toLowerCase() === activeField ? " activeField" : "";
        return (
            <div
                className={
                    "field-group-" + className + " " + className_activeField
                }
            >
                <a className="label">{className}</a>

                <input
                    type="text"
                    value={
                        disabled
                            ? FIELDNAME.toLowerCase()
                            : FIELDNAME.toUpperCase()
                    }
                    className={className}
                    disabled={className !== "M_value_KEY"}
                    onFocus={() => {
                        if (
                            !activeField ||
                            activeField !== fieldname.toLowerCase()
                        ) {
                            setActiveField(fieldname.toLowerCase());
                        }
                        /* * make overlay backdrop cover all screen locked UI 
                         * * except input.M_value_KEY, save- and cancel-button
                         * * and Error_FIELDNAME(
                                <span className="error-text">{error_text}</span>,
                            );      
                         */
                        // setTimeout(() => {
                        set_is_Editing(true);
                        // }, 50);
                    }}
                    // onBlur={() => {
                    //     set_FIELDNAME(activeField.toUpperCase());
                    // }}
                    onChange={async (event) =>
                        await handle_Fieldname_Change(
                            event.target.value,
                            set_FIELDNAME,
                            // { UPDATE: true },
                        )
                    }
                />

                {show_CRUD_BTN && (
                    <>
                        <button
                            className={"save-button"}
                            //no continue, if no data , or data invalide
                            disabled={!FIELDNAME}
                            onClick={async () => {
                                await rename_M_value_KEY_and_fieldname(
                                    FIELDNAME,
                                );
                                // setActiveField(null);
                                // setTimeout(() => {
                                setActiveField(FIELDNAME.toLowerCase());
                                // }, 50);
                                set_is_Editing(false);
                            }}
                        >
                            💾
                        </button>
                        <button
                            className={"cancel-button"}
                            onClick={() => {
                                //reset FIELDNAME
                                set_FIELDNAME(activeField.toUpperCase());
                                set_is_Editing(false);
                                setActiveField(null);
                            }}
                        >
                            ↩️
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        // <div className="field-wrapper-box">
        <>
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
        </>
        // </div>
    );
}
