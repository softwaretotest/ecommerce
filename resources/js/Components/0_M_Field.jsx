// resources/js/Components/0_M_Field.jsx
import { renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { renderCheckboxList } from "@/Components/0_M_CheckBox.jsx";
import { use_M_Option } from "@/Hooks/use_M_Option.js"; // Import new hook
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

export default function Field({ field_data }) {
    const { getOptions } = use_M_Option(); // Use the hook directly
    const [fieldname, ...fieldDataList] = field_data;
    const { activeTab, activeSubTab } = use_M_Store();

    function make_dropdown(label, names) {
        return (
            <>
                <div className="dropdown-column">
                    <div className="dropdown-label">{label}</div>
                    <p>Field - make_dropdown - field_data = {field_data}</p>

                    {renderDropdown(names, fieldDataList, field_data)}
                </div>
            </>
        );
    }

    function make_checkbox(label, names) {
        return (
            <>
                <div className="dropdown-column">
                    <div className="dropdown-label">{label}</div>
                    {renderCheckboxList(
                        names,
                        fieldDataList,
                        label,
                        field_data,
                    )}
                </div>
            </>
        );
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
            </div>

            <div className="field-dropdown-grid">
                {make_dropdown("D", ["d"])}
                {make_checkbox("CD", ["cd", "cud"])}
                {make_dropdown("U", ["u"])}
                {make_checkbox("CU", ["cu", "cud"])}
            </div>
        </div>
    );
}
