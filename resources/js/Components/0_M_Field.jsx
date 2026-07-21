// resources/js/Components/0_M_Field.jsx
import { renderDropdown_D } from "@/Components/0_M_Dropdown_D.jsx";
import { renderDropdown_U } from "@/Components/0_M_Dropdown_U.jsx";
import { renderCheckboxList } from "@/Components/0_M_CheckBox.jsx";

import { use_M_Option } from "@/Hooks/use_M_Option.js"; // Import new hook
import { M_value_Service } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

export default function Field({ field_data }) {
    const fieldname = field_data[0];
    const is_CURRENCY = field_data[0].toLowerCase() === "currency";

    function make_dropdown_D(label, names) {
        return (
            <>
                <div className="dropdown-column">
                    <div className="dropdown-label">{label}</div>
                    {renderDropdown_D(names, field_data)}
                </div>
            </>
        );
    }

    function make_dropdown_U(label, names) {
        return (
            <>
                <div className="dropdown-column">
                    <div className="dropdown-label">{label}</div>
                    {renderDropdown_U(names, field_data)}
                </div>
            </>
        );
    }

    function make_checkbox(label, names) {
        return (
            <>
                <div className="dropdown-column">
                    <div className="dropdown-label">{label}</div>
                    {renderCheckboxList(names, label, field_data)}
                </div>
            </>
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

    /**
     * * onClick DELETE-Button of activeField
     * * remove the active field from M_value
     * * and update JSON Backend
     */
    async function delete_field() {
        const FIELDNAME = document
            .querySelector(".App_Data_KEY")
            .value.toUpperCase();
        const isConfirmed = window.confirm(
            `Are you sure to delete ${FIELDNAME}?`,
        );
        if (isConfirmed) {
            const new_M_value = { ...use_M_Store.getState().M_value };

            //delete object(M_value)'s item by KEY(FIELDNAME)
            delete new_M_value[FIELDNAME];

            await M_value_Service.update(new_M_value);
        }
    }

    return (
        <div className="field-wrapper-box">
            <div className="field-header-container">
                <input
                    type="text"
                    defaultValue={fieldname.toUpperCase()}
                    className="App_Data_KEY"
                />
                <span className="field-separator-colon">:</span>
                <input
                    type="text"
                    defaultValue={fieldname}
                    className="App_Data_VALUE"
                />
                <button className="delete-button" onClick={delete_field}>
                    DELETE
                </button>
            </div>
            {CHECKBOX_and_DROPDOWN}
        </div>
    );
}
