// resources/js/Components/0_M_Dropdown.jsx

import { use_M_Option } from "@/Hooks/use_M_Option.js";

export function M_Option({ M_Class_Name_List, fieldDataList }) {
    const { getOptions } = use_M_Option(); // ดึงจาก Hook โดยตรง

    if (!M_Class_Name_List) return null;
    // console.log(
    //     "0_M_Dropdown - M_Option - M_Class_Name_List = ",
    //     M_Class_Name_List,
    // );
    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name); // use getOptions from Hook
        // if (M_Class_Name === "s") {
        //     throw new Error(
        //         "0_M_Dropdown - M_Option - M_Class_Name = s - options = ",
        //         options,
        //     );
        // }

        return options.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));
    });
}

/**
 * Renders a dropdown select element
 * *
 * * Example usage:
 * * M_Class_Name_List: ["f"]
 * * fieldDataList: ["f::ORDER_NR"]
 * *
 * * Result:
 * * <select defaultValue="ORDER_NR"> ... </select>
 */
export function renderDropdown(M_Class_Name_List, fieldDataList = []) {
    const foundValue = fieldDataList.find((item) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;
        return (
            typeof valueToTest === "string" &&
            M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"))
        );
    });
    // console.log(
    //     "0_M_Dropdown - renderDropdown - M_Class_Name_List = ",
    //     M_Class_Name_List,
    // );
    // console.log("0_M_Dropdown - renderDropdown - foundValue = ", foundValue);
    let defaultValue = "";
    if (foundValue) {
        const stringValue = Array.isArray(foundValue)
            ? foundValue[0]
            : foundValue;
        defaultValue = stringValue.split("::")[1];
    }

    // console.log(
    //     "0_M_Dropdown - renderDropdown - defaultValue = ",
    //     defaultValue,
    // );
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
