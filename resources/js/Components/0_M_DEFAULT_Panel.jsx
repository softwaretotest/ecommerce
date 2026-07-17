// resources/js/Components/0_M_DEFAULT_Panel.jsx
import { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "@/Services/0_M_value_Service";

import { DEFAULT_VALUES_MAP } from "./0_M_MAP";
import { prepare_new_M_value_for_Update_CD_DEFAULT_Panel } from "@/Components/0_M_value_Updater_CD_DEFAULT_Panel";
/**
 * Render input field for DEFAULT parameter based on field type
 * *
 * * Example usage:
 * * fieldname: "f::PRICE"
 * * DEFAULT_Panel: ["cd::DEFAULT", 0]
 * *
 * * Result:
 * * <div className="M_params-container">
 * * <span className="M_params-label">Default:</span>
 * * <input className="M_params-input" type="number" value="0" />
 * * </div>
 * *
 * * e.g. DEFAULT_Panel = [d::DEFAULT, 10, 2]
 */
export function DEFAULT_Panel({ field_data }) {
    const fieldname = field_data[0];

    // const debug = true;
    const debug = true && fieldname === "image";

    const M_value = use_M_Store((state) => state.M_value);
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeSubTab = use_M_Store((state) => state.activeSubTab);

    if (debug)
        console.log(
            `[ START DEBUG ] ---------- DEFAULT_Panel ----------------`,
        );
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [0] DEFAULT_Panel | field_data = `,
            field_data,
        );
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [1] DEFAULT_Panel | fieldname = ${fieldname}`,
        );

    const upperFieldName = fieldname.toUpperCase();
    const M_value_field_data = M_value[upperFieldName];
    /**
     * M_value_field_data = ['is_active', 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', false]]
     */
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [2.0] M_value_field_data = `,
            M_value_field_data,
        );

    /**
     * * existing_field_data = data for replace
     * * ['is_active', 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', false]]
     * *
     * * we must include || field_data , in case first load M_value not exists
     */
    const existing_field_data = M_value_field_data || field_data;
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [2.1] existing_field_data for ${fieldname}:`,
            existing_field_data,
        );

    /**
     * * DEFAULT_array = real array with params of DEFAULT in M_value before change
     * * ['cd::DEFAULT', null]
     */
    const DEFAULT_array =
        existing_field_data.find(
            (item) => Array.isArray(item) && item[0] === "cd::DEFAULT",
        ) || [];
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [3] DEFAULT_array for ${fieldname}:`,
            DEFAULT_array,
        );

    /**
     * * d_Class
     * * e.g. d::BOOLEAN for IS_ACTIVE
     * * e.g. [d::DECIMAL,10,10] for STOCK
     */
    const d_Class_Item = existing_field_data.find((item) => {
        // Case String
        if (typeof item === "string") return item.startsWith("d::");
        // Case Array, look first Item = string (item[0]) , my App M_value convention
        if (Array.isArray(item)) return item[0] && item[0].startsWith("d::");
        return false;
    });

    if (!d_Class_Item) return null;

    // remove d:: from d_Class_Name Case String and Case Array
    const d_Class_Name = Array.isArray(d_Class_Item)
        ? d_Class_Item[0].substring(3) //Array
        : d_Class_Item.substring(3); //String

    if (debug)
        console.log(
            " DEFAULT_Panel - 99999999999999 [3.1] d_Class_Item = ",
            d_Class_Item,
        );
    if (debug)
        console.log(
            " DEFAULT_Panel - 99999999999999 [3.2] d_Class_Name = ",
            d_Class_Name,
        );

    const dType = "d::" + d_Class_Name;
    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [4] dType for ${fieldname}:`,
            dType,
        );

    /**
     * * DEFAULT_array = real array with params of DEFAULT in M_value before change
     * * ['cd::DEFAULT', null]
     */
    const current_display_value = DEFAULT_array[1];

    if (debug)
        console.log(
            ` DEFAULT_Panel - 99999999999999 [5] Final Value determined for ${fieldname}:`,
            current_display_value,
        );
    if (debug)
        console.log(`[ END DEBUG ] ---------- DEFAULT_Panel ----------------`);

    async function set_DEFAULT_Panel_Actions(event) {
        const new_M_value = prepare_new_M_value_for_Update_CD_DEFAULT_Panel(
            fieldname,
            event,
        );
        await M_value_Service.update(new_M_value);
    }

    return (
        <div className="M_params-container">
            <div className="M_params-field">
                {d_Class_Name === "BOOLEAN" && (
                    <select
                        className="DEFAULT_Panel"
                        defaultValue={String(current_display_value ?? "")}
                        onChange={(event) => set_DEFAULT_Panel_Actions(event)}
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                )}

                {(d_Class_Name === "INTEGER" ||
                    d_Class_Name === "DECIMAL" ||
                    d_Class_Name === "UNSIGNED_BINT") && (
                    <input
                        className="DEFAULT_Panel"
                        type="number"
                        defaultValue={current_display_value ?? ""}
                        placeholder={`Enter ${d_Class_Name} value`}
                        onChange={(event) => set_DEFAULT_Panel_Actions(event)}
                    />
                )}

                {d_Class_Name === "STRING" && (
                    <input
                        className="DEFAULT_Panel"
                        type="text"
                        defaultValue={current_display_value ?? ""}
                        placeholder={`Enter ${d_Class_Name} value`}
                        onChange={(event) => set_DEFAULT_Panel_Actions(event)}
                    />
                )}
            </div>
        </div>
    );
}
