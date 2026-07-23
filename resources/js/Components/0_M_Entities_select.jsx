// resources/js/Components/0_M_Entities_select.jsx

import { use_M_Store } from "@/Stores/0_M_Store";
import { M_Option } from "@/Components/0_M_Option";

/**
 * *Renders a dropdown select element
 * @param f_s_Class_Array = all f_s_Class_Array of table t::orders
 * * e.g. ['f::ORDER_NR', 'f::PRODUCT_ID', 'f::USER_ID', 'f::QUANTITY', 'f::CONFIRM_ORDER']
 * @param f_s_Class_Name = e.g. 's::EMAIL' , 'f::NAME' , 'f::USER_ID' etc.
 * @returns  A select-input with defaultValue and option for Entities
 */
export function render_F_S_select(f_s_Class_Array, f_s_Class_Name) {
    const M_Class_Name_List = ["f", "s"];
    let defaultValue = "";
    if (typeof f_s_Class_Name === "string" && f_s_Class_Name.includes("::")) {
        defaultValue = f_s_Class_Name.split("::")[1];
    } else if (typeof f_s_Class_Name === "string") {
        defaultValue = f_s_Class_Name;
    } else {
        /**
         * * this bug , found after we added FOREIGN logic
         * * to auto. unselect D U CD CU , and restore D and U
         * * e.g.
         * * installHook.js:1 ⚠️ render_F_S_select received non-string: (3) ['d::DECIMAL', 10, 2]
         */
        console.warn(
            "⚠️ render_F_S_select received non-string:",
            f_s_Class_Name,
        );
    }

    return (
        <>
            <select className="M_field-dropdown" defaultValue={defaultValue}>
                <option value="">--</option>
                {/* <M_Option
                    M_Class_Name_List={M_Class_Name_List}
                    field_data={f_s_Class_Array}
                /> */}
            </select>
        </>
    );
}
