// resources/js/Components/0_M_Field.jsx
import { renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { renderCheckboxList } from "@/Components/0_M_CheckBox.jsx";
import { use_M_Option } from "@/Hooks/use_M_Option.js"; // Import new hook
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

export default function Field({ field_data }) {
    const { getOptions } = use_M_Option(); // Use the hook directly
    const [fieldname, ...fieldDataList] = field_data;
    const { activeTab, activeSubTab } = use_M_Store();

    // console.log(`[FIELD_DEBUG] Field: ${fieldname} | Tab: ${activeTab}`, {
    //     fieldDataList,
    // });
    // console.log(`[FIELD_DEBUG] Field: field_data`, field_data);

    const groups = [
        { label: "D", keys: ["d"] },
        { label: "CD", keys: ["cd", "cud"] },
        { label: "U", keys: ["u"] },
        { label: "CU", keys: ["cu", "cud"] },
    ];

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
                {groups.map((group) => (
                    <div key={group.label} className="dropdown-column">
                        <div className="dropdown-label">{group.label}</div>
                        {group.label === "D" || group.label === "U"
                            ? renderDropdown(
                                  group.keys,
                                  fieldDataList,
                                  field_data,
                                  //   M_value,
                                  activeSubTab,
                              )
                            : renderCheckboxList(
                                  group.keys,
                                  fieldDataList,
                                  group.label,
                                  field_data,
                                  //   M_value,
                                  //   activeSubTab,
                              )}
                    </div>
                ))}
            </div>
        </div>
    );
}
