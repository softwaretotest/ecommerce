// resources/js/Components/0_M_Dropdown.jsx

import { use_M_Option } from "@/Hooks/use_M_Option.js";

export function M_Option({ M_Class_Name_List, fieldDataList }) {
    const { getOptions } = use_M_Option();

    if (!M_Class_Name_List) return null;

    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name);

        return options.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));
    });
}

export function renderDropdown(M_Class_Name_List, fieldDataList = []) {
    const foundValue = fieldDataList.find((item) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;
        return (
            typeof valueToTest === "string" &&
            M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"))
        );
    });

    let defaultValue = "";
    if (foundValue) {
        const stringValue = Array.isArray(foundValue)
            ? foundValue[0]
            : foundValue;
        defaultValue = stringValue.split("::")[1];
    }

    return (
        <select className="M_field-dropdown" defaultValue={defaultValue}>
            <option value="">--</option>
            <M_Option
                M_Class_Name_List={M_Class_Name_List}
                fieldDataList={fieldDataList}
            />
        </select>
    );
}
