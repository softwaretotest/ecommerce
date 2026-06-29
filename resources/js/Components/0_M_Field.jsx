// resources/js/Components/0_M_Field.jsx
import { renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { renderCheckboxList } from "@/Components/0_M_CheckBox.jsx";
import { use_M_Option } from "@/Hooks/use_M_Option.js"; // Import new hook

export default function Field({ field_data }) {
    const { getOptions } = use_M_Option(); // Use the hook directly
    const [name, ...fieldDataList] = field_data;

    const groups = [
        { label: "D", keys: ["d"] },
        { label: "U", keys: ["u"] },
        { label: "CD", keys: ["cd", "cud"] },
        { label: "CU", keys: ["cu", "cud"] },
    ];

    return (
        <div className="field-wrapper-box">
            <div className="field-header-container">
                <input
                    type="text"
                    defaultValue={name.toUpperCase()}
                    className="App_Data_KEY"
                />
                <span className="field-separator-colon">:</span>
                <input
                    type="text"
                    defaultValue={name}
                    className="App_Data_VALUE"
                />
            </div>

            <div className="field-dropdown-grid">
                {groups.map((group) => (
                    <div key={group.label} className="dropdown-column">
                        <div className="dropdown-label">{group.label}</div>
                        {group.label === "D" || group.label === "U"
                            ? renderDropdown(group.keys, fieldDataList)
                            : renderCheckboxList(
                                  group.keys,
                                  fieldDataList,
                                  group.label,
                              )}
                    </div>
                ))}
            </div>
        </div>
    );
}
