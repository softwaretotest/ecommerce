// resources/js/Components/0_M_Dropdown.jsx

export function M_Option(props) {
    const {
        M_Class_Name_List,
        getOptions_for_Checkbox_or_Dropdown,
        fieldDataList,
    } = props;

    if (!M_Class_Name_List) return null;

    return M_Class_Name_List.flatMap(function (M_Class_Name) {
        const options = getOptions_for_Checkbox_or_Dropdown(M_Class_Name);

        const prefix = M_Class_Name + "::";
        const foundItem = fieldDataList
            ? fieldDataList.find((i) => {
                  const valueToTest = Array.isArray(i) ? i[0] : i;
                  return (
                      typeof valueToTest === "string" &&
                      valueToTest.startsWith(prefix)
                  );
              })
            : null;

        const defaultValue = foundItem
            ? Array.isArray(foundItem)
                ? foundItem[0].split("::")[1]
                : foundItem.split("::")[1]
            : null;

        return options.map(function (item) {
            return (
                <option key={item} value={item}>
                    {item}
                </option>
            );
        });
    });
}

export function renderDropdown(
    M_Class_Name_List,
    fieldDataList = [],
    getOptions_for_Checkbox_or_Dropdown,
) {
    const foundValue = fieldDataList.find(function (item) {
        /**
         * check is Array , because e.g.
         * sometime item = ["cd::DEFAULT",0]   array
         * sometime item = "u::NUMBER"         string
         */
        let valueToTest = item;
        if (Array.isArray(item)) {
            valueToTest = item[0];
        }

        if (typeof valueToTest !== "string") return false;

        // startsWith check convention e.g. cud::REQUIRED
        return M_Class_Name_List.some(function (className) {
            return valueToTest.startsWith(className + "::");
        });
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
                getOptions_for_Checkbox_or_Dropdown={
                    getOptions_for_Checkbox_or_Dropdown
                }
                fieldDataList={fieldDataList}
            />
        </select>
    );
}
