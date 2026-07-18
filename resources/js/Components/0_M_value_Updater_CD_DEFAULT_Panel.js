// \resources\js\Components\0_M_value_Updater_CD_DEFAULT_Panel.js
import { use_M_Store } from "@/Stores/0_M_Store";
import { get_D_NAME } from "@/Components/0_M_Data_Helper";

export function prepare_new_M_value_for_Update_CD_DEFAULT_Panel(
    fieldname,
    event,
) {
    const debug = true && fieldname === "image";

    const old_M_value = use_M_Store.getState().M_value;

    if (debug)
        console.log(
            `----------- [ START : DEBUG ] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions -----------`,
        );
    if (debug)
        console.log(
            ` [1] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions event.target = `,
            event.target,
        );
    if (debug)
        console.log(
            ` [2] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions event.target.value = `,
            event.target.value,
        );

    const new_M_value = { ...old_M_value };

    if (debug)
        console.log(
            ` [3] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions new_M_value = `,
            new_M_value,
        );

    if (debug)
        console.log(
            ` [4] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions ["d:DEFAULT", event.target.value] = `,
            ["d:DEFAULT", event.target.value],
        );

    /**
     * fieldname_UPPERCASE = PRICE , STOCK
     */
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === fieldname.toLowerCase(),
    );
    if (debug)
        console.log(
            ` [5] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions fieldname_UPPERCASE = `,
            fieldname_UPPERCASE,
        );

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * ['stock' , ['d::DECIMAL' , 10 , 10] , 'u::NUMBER', ['cd::DEFAULT', 0] , 'cud::REQUIRED']
     */
    const field_data = Array.isArray(new_M_value[fieldname_UPPERCASE])
        ? [...new_M_value[fieldname_UPPERCASE]]
        : [];
    if (debug)
        console.log(
            ` [6] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions field_data = `,
            field_data,
        );

    /**
     * * Filter out all existing 'cd::DEFAULT' or ['cd::DEFAULT',10]
     * * before = e.g.
     * * ['image', 'u::FILE', ['cd::DEFAULT', false], 'd::BOOLEAN'] or
     * * ['image', 'u::FILE', 'cd::DEFAULT', 'd::BOOLEAN']
     * * after = ['image', 'u::FILE', 'cd::DEFAULT', 'd::BOOLEAN']
     */
    const D_NAME = get_D_NAME(field_data);
    const rawValue = event.target.value;

    // Type Casting
    let finalValue = rawValue;
    if (D_NAME === "BOOLEAN") {
        finalValue = rawValue === "true"; // this save in JSON as Boolean true/false
    } else if (["INTEGER", "DECIMAL", "UNSIGNED_BINT"].includes(D_NAME)) {
        finalValue = Number(rawValue);
    }

    const field_data_without_cd_DEFAULT = field_data.filter((item) => {
        const targetString = Array.isArray(item) ? item[0] : item;
        return (
            typeof targetString === "string" &&
            !targetString.includes("DEFAULT")
        );
    });

    if (debug)
        console.log(
            ` [7] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions field_data_without_cd_DEFAULT = `,
            field_data_without_cd_DEFAULT,
        );

    const field_data_with_NEW_cd_DEFAULT = [
        ...field_data_without_cd_DEFAULT,
        ["cd::DEFAULT", finalValue],
    ];

    if (debug)
        console.log(
            ` [8] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions field_data_with_NEW_cd_DEFAULT = `,
            field_data_with_NEW_cd_DEFAULT,
        );

    new_M_value[fieldname_UPPERCASE] = field_data_with_NEW_cd_DEFAULT;
    if (debug)
        console.log(
            ` [8] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions new_M_value UPDATED d::DEFAULT = `,
            new_M_value,
        );
    if (debug)
        console.log(
            `----------- [ END : DEBUG ] DEFAULT_Panel -- ${fieldname} -- set_DEFAULT_Panel_Actions -----------`,
        );
    return new_M_value;
}
