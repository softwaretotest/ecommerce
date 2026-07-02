// 0_M_DEFAULT_Panel.jsx
import { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { DEFAULT_VALUES_MAP, FIELD_PARAMS_MAP } from "./0_field_params_map";
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
// export function DEFAULT_Panel({ field_data }) {
export function DEFAULT_Panel({ field_data }) {
    const M_value = use_M_Store((state) => state.M_value);
    const fieldname = field_data[0];

    console.log(`[1] DEFAULT_Panel | Field: ${fieldname}`);

    const upperFieldName = fieldname.toUpperCase();
    const sourceData = M_value ? M_value[upperFieldName] : null;
    /**
     * sourceData = ['is_active', 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', null]]
     */
    console.log("[2.0] sourceData = ", sourceData);

    /**
     * * effectiveData = data for replace
     * * ['is_active', 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', false]]
     */
    const effectiveData = sourceData || field_data;
    console.log(`[2.1] effectiveData for ${fieldname}:`, effectiveData);

    /**
     * * DEFAULT_array = real array with params of DEFAULT in M_value before change
     * * ['cd::DEFAULT', null]
     */
    const DEFAULT_array = effectiveData.find(
        (item) => Array.isArray(item) && item[0] === "cd::DEFAULT",
    );
    console.log(`[3] DEFAULT_array for ${fieldname}:`, DEFAULT_array);

    /**
     * * d_Class
     * * e.g. BOOLEAN for IS_ACTIVE
     */
    const d_Class = effectiveData.find(
        (item) => typeof item === "string" && item.includes("d:"),
    );
    console.log(" [3.1] d_Class = ", d_Class);

    /**
     * * d_Class_Name
     * * e.g. BOOLEAN for IS_ACTIVE
     */
    const d_Class_Name = d_Class
        ? d_Class.split("::")[1] || d_Class.split(":")[1]
        : "STRING";
    console.log(" [3.2] d_Class_Name = ", d_Class_Name);

    // const dType = "d::" + d_Class_Name;
    // console.log(`[4] dType identified for ${fieldname}:`, dType);

    /**
     * * d_MAP_KEY = find d_Class_Name in DEFAULT_VALUES_MAP
     * * e.g. BOOLEAN for IS_ACTIVE
     */
    let d_MAP_KEY = d_Class_Name;
    if (d_Class_Name === "INTEGER" || d_Class_Name === "DECIMAL") {
        d_MAP_KEY = "INTEGER";
    } else if (d_Class_Name === "BOOLEAN") {
        d_MAP_KEY = "BOOLEAN";
    } else if (d_Class_Name === "STRING") {
        d_MAP_KEY = "STRING";
    } else {
        d_MAP_KEY = "UNKNOWN";
    }
    console.log("[4] d_MAP_KEY = ", d_MAP_KEY);

    /**
     * * fallbackValue = value of d_MAP_KEY
     * * e.g. false  of   DEFAULT_VALUES_MAP.BOOLEAN = false,
     */
    let fallbackValue = "";
    if (DEFAULT_VALUES_MAP.hasOwnProperty(d_MAP_KEY)) {
        fallbackValue = DEFAULT_VALUES_MAP[d_MAP_KEY];
    } else {
        fallbackValue = "";
    }
    console.log(`[5] d_MAP_KEY: ${d_MAP_KEY} | fallbackValue:`, fallbackValue);

    /**
     * get data from FIELD_PARAMS_MAP
     * */
    const current_params =
        FIELD_PARAMS_MAP[d_Class_Name] || FIELD_PARAMS_MAP["DEFAULT"];

    /**
     * * DEFAULT_array = real array with params of DEFAULT in M_value before change
     * * ['cd::DEFAULT', null]
     */
    const current_display_value = DEFAULT_array[1];

    console.log(
        `[6] Final Value determined for ${fieldname}:`,
        current_display_value,
    );

    // [7] Render แบบ Dynamic ตาม Config (ไม่มี Switch Case)

    // 3. Render บล็อกแบบ Explicit ทุกเคส (ไม่มี onChange)
    return (
        <div className="M_params-container">
            {current_params.map((param, index) => (
                <div key={index} className="M_params-field">
                    <label>{param.label}</label>

                    {/* กรณีที่ 1: เป็น BOOLEAN */}
                    {d_Class_Name === "BOOLEAN" && (
                        <select
                            className="DEFAULT_Panel"
                            defaultValue={String(param.value ?? "")}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    )}

                    {/* กรณีที่ 2: เป็น INTEGER หรือ DECIMAL */}
                    {(d_Class_Name === "INTEGER" ||
                        d_Class_Name === "DECIMAL") && (
                        <input
                            className="DEFAULT_Panel"
                            type="number"
                            defaultValue={param.value ?? ""}
                            placeholder={`Enter ${param.label}`}
                        />
                    )}

                    {/* กรณีที่ 3: เป็น STRING */}
                    {d_Class_Name === "STRING" && (
                        <input
                            className="DEFAULT_Panel"
                            type="text"
                            defaultValue={param.value ?? ""}
                            placeholder={`Enter ${param.label}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
