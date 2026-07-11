// resources/js/Components/0_M_Dropdown_D_params_self_heal.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "@/Services/0_M_value_Service";

import { D_PARAMS_MAP } from "@/Components/0_M_MAP";

import JSON_Content from "@/Components/0_M_JSON_Content";
export function prepare_new_M_value_for_Update_D_self_heal(
    D_NAME,
    d_Array,
    old_M_value,
    set_M_value,
    activeField,
) {
    console.log("!!! เข้ามาในฟังก์ชัน Self-Heal แล้ว !!!");
    console.log("Params:", { D_NAME, d_Array, activeField });
    const new_M_value = { ...old_M_value };

    // logic to find d:: in old_M_value and replace by d
    const fieldname_UPPERCASE = Object.keys(new_M_value).find(
        (key) => key.toLowerCase() === activeField.toLowerCase(),
    );
    // console.log(" 1. fieldname_UPPERCASE = ", fieldname_UPPERCASE);

    const d_Class_UPPERCASE = `d::${D_NAME}`;
    // console.log(" 2. d_Class_UPPERCASE = ", d_Class_UPPERCASE);

    /**
     * * field_data = we use this name exactly case-sensitive in whole app
     * * e.g.
     * * ['image', 'u::FILE', ['d::DECIMAL', 10, 2]]
     */
    const field_data = [...new_M_value[fieldname_UPPERCASE]];
    // console.log(" 3. Extracted field_data (before clean):", field_data);

    /**
     * * Filter out all existing d:: , cd:: , cud::
     * * ['image', 'd::STRING', 'u::FILE', null, null]
     */
    const field_data_without_d_with_null = field_data.filter((item) => {
        // if Array the first item[0] is always String (App Convention)
        const targetString = Array.isArray(item) ? item[0] : item;

        const isD = targetString.startsWith("d::");

        // remove d cd cud (return false)
        return !isD;
    });

    /**
     * * Filter out null items
     * * ['image', 'd::STRING', 'u::FILE']
     */
    const field_data_without_d = field_data_without_d_with_null.filter(
        (item) => item != null,
    );
    // console.log(" 4. field_data_without_d :", field_data_without_d);

    new_M_value[fieldname_UPPERCASE] = [...field_data_without_d, d_Array];
    // console.log(" 5. new_M_value :", new_M_value);

    /**
     * * new_field_data = data in the focused field after update cd and cud
     * * e.g.
     * * ['price', ['d::DECIMAL',10,2], 'u::NUMBER', 's::CURRENCY', ['cd::DEFAULT',0]]
     */
    const new_field_data = new_M_value[fieldname_UPPERCASE];
    // console.log(" 6. Final new_field_data:", new_field_data);
    // console.log(" 7. Full final new_M_value:", new_M_value);
    // console.log("--- [DEBUG: END] ---");

    return new_M_value;
}
