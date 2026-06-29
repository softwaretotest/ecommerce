// 0_M_Options.jsx

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
