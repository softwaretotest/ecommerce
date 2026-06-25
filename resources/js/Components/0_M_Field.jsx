// resources/js/Components/0_M_Field.jsx
import { M_Option, renderDropdown } from "@/Components/0_M_Dropdown.jsx";
import { renderCheckboxList } from "@/Components/0_M_CheckBox.jsx";
import { use_M_Data } from "@/Services/0_M_DataProvider.jsx";

export default function Field({ field_data }) {
    const metadata = use_M_Data();

    const [name, ...fieldDataList] = field_data;

    const groups = [
        { label: "D", keys: ["d"] },
        { label: "U", keys: ["u"] },
        { label: "CD", keys: ["cd", "cud"] },
        { label: "CU", keys: ["cu", "cud"] },
    ];

    function getOptions_for_Checkbox_or_Dropdown(M_Class_Name) {
        if (!metadata) return [];

        const mDataContainer = metadata.m_data;

        const targetClass = mDataContainer?.[M_Class_Name];

        if (targetClass) {
            const keys = Object.keys(targetClass);
            return keys;
        }

        return [];
    }

    return (
        <div className="field-wrapper-box">
            <div className="field-header-container">
                <input
                    type="text"
                    defaultValue={name.toUpperCase()}
                    className="field-input-blue"
                />
                <span className="field-separator-colon">:</span>
                <input
                    type="text"
                    defaultValue={name}
                    className="field-input-green"
                />
            </div>

            <div className="field-dropdown-grid">
                {groups.map(function (group) {
                    const M_Class_Name_List = group.keys;

                    return (
                        <div key={group.label} className="dropdown-column">
                            <div className="dropdown-label">{group.label}</div>

                            {group.label === "D" || group.label === "U"
                                ? // Dropdown for D and U
                                  renderDropdown(
                                      M_Class_Name_List,
                                      fieldDataList,
                                      getOptions_for_Checkbox_or_Dropdown,
                                  )
                                : // Checkbox for CD and CU
                                  renderCheckboxList(
                                      M_Class_Name_List,
                                      fieldDataList,
                                      getOptions_for_Checkbox_or_Dropdown,
                                  )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
