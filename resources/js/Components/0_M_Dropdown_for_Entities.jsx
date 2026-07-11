// resources/js/Components/0_M_Dropdown_for_Entities.jsx

import { use_M_Option } from "@/Hooks/use_M_Option.js";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

export function M_Option({ M_Class_Name_List, fieldDataList }) {
    const { getOptions } = use_M_Option(); // ดึงจาก Hook โดยตรง

    if (!M_Class_Name_List) return null;
    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name); // use getOptions from Hook

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
 * *
 * * Params:
 * * defaultValue = field name , e.g. DECIMAL , STRING
 * * field_params = e.g. for DECIMAL ( total_digit , scale )
 * *
 */
export function renderDropdown_for_entities(
    M_Class_Name_List,
    fieldDataList = [],
    field_data,
    M_value,
    activeSubTab,
) {
    const { activeTab } = use_M_Store();

    const foundValue = fieldDataList.find((item) => {
        let valueToTest = Array.isArray(item) ? item[0] : item;
        return (
            typeof valueToTest === "string" &&
            M_Class_Name_List.some((c) => valueToTest.startsWith(c + "::"))
        );
    });
    // console.log("[1] foundValue:", foundValue);

    let defaultValue = "";
    let field_params = [];

    if (foundValue) {
        if (Array.isArray(foundValue)) {
            const [stringValue, ...params] = foundValue;
            defaultValue = stringValue.split("::")[1];
            field_params = params;
        } else {
            defaultValue = foundValue.split("::")[1];
            field_params = [];
        }
    }
    // console.log("[2] defaultValue :", defaultValue);
    // console.log("[3] field_params :", field_params);

    return (
        <>
            <select className="M_field-dropdown" defaultValue={defaultValue}>
                <option value="">--</option>
                <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    fieldDataList={fieldDataList}
                />
            </select>
            {/* {field_params.length > 0 && (
                <Field_Params
                    param_name={defaultValue}
                    field_params={field_params}
                />
            )} */}
        </>
    );
}
