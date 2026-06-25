// 0_M_CheckBox.jsx
import { useState } from "react";
import { CD_Rule_Check } from "@/Components/0_M_CD_Rule_Check.jsx";

export function renderCheckboxList(
    M_Class_Name_List,
    fieldDataList = [],
    getOptions_for_Checkbox_or_Dropdown,
) {
    const foundValues = fieldDataList.filter(function (item) {
        let valueToTest = Array.isArray(item) ? item[0] : item;

        if (typeof valueToTest !== "string") return false;

        return M_Class_Name_List.some((className) =>
            valueToTest.startsWith(className + "::"),
        );
    });

    // e.g. a db field can have multiple cd = ["REQUIRED", "UNIQUE"])
    const defaultValues = foundValues.map(function (val) {
        const stringVal = Array.isArray(val) ? val[0] : val;
        return stringVal.split("::")[1];
    });

    const options = M_Class_Name_List.flatMap((M_Class_Name) =>
        getOptions_for_Checkbox_or_Dropdown(M_Class_Name),
    );

    const [checkedItems, setCheckedItems] = useState(defaultValues);

    return (
        <div className="M_checkbox-list">
            {options.map((option) => (
                <label key={option}>
                    <input
                        type="checkbox"
                        value={option}
                        defaultChecked={defaultValues.includes(option)}
                        onChange={(e) => {
                            const isChecked = e.target.checked;

                            const nextState = CD_Rule_Check(
                                checkedItems,
                                option,
                                isChecked,
                            );
                            setCheckedItems(nextState);
                        }}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
}
