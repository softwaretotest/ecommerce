// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";

export default function TabContent({
    M_Class_Name,
    // M_value,
    activeField,
    setActiveField,
    activeSubTab,
}) {
    const setFocus = use_M_Store((state) => state.setFocus);
    const update = use_M_Store((state) => state.update);
    const M_value = use_M_Store((state) => state.M_value);

    // use path to update, e.g. "APP_DATA.NAME"
    const handleUpdate = (fieldname, newValue) => {
        update(`APP_DATA.${fieldname}`, newValue);
    };

    if (!M_value || typeof M_value !== "object") {
        return <div className="ui-placeholder">No UI for {M_Class_Name}</div>;
    }

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    return (
        <>
            <div>
                <label>M_Class_Name = {M_Class_Name}</label>
            </div>
            <div className="input-engine-container">
                {/* LOOP OF FIELDS e.g. 
                M_Class_Name = f , t , s , d , u , cd , cu , cud , entities*/}
                {Object.entries(M_value).map(([fieldname, field_data]) => (
                    <div
                        key={fieldname}
                        ref={(DOM_Node) =>
                            (scrollRefs.current[fieldname] = DOM_Node)
                        }
                        className={`form-subtab-content-row ${activeField === fieldname ? "is-focused" : ""}`}
                        onClick={() => {
                            setFocus(fieldname, M_value);
                            setActiveField(fieldname);
                        }}
                    >
                        {["d", "u", "cd", "cu", "cud"].includes(
                            M_Class_Name,
                        ) && (
                            <>
                                {/* M_Value UPPERCASE = e.g. NULLABLE */}
                                <input
                                    className="M_Data_KEY"
                                    defaultValue={
                                        M_Class_Name === "t"
                                            ? fieldname
                                            : fieldname.toUpperCase()
                                    }
                                />
                                <span className="field-separator-colon">:</span>

                                {/* M_Value lowerCASE = e.g. nullable */}
                                <input
                                    type="text"
                                    className="M_Data_VALUE"
                                    defaultValue={field_data}
                                    onBlur={(e) =>
                                        handleUpdate(fieldname, e.target.value)
                                    }
                                />
                            </>
                        )}

                        {/* middle column: Input Fields */}
                        {M_Class_Name === "s" && Array.isArray(field_data) && (
                            <SpecialField
                                field_data={field_data}
                                M_value={M_value}
                                activeSubTab={activeSubTab}
                            />
                        )}

                        {M_Class_Name === "f" && Array.isArray(field_data) && (
                            <Field
                                field_data={field_data}
                                M_value={M_value}
                                activeSubTab={activeSubTab}
                            />
                        )}

                        {M_Class_Name === "t" && (
                            <DB_Tablename field_data={field_data} />
                        )}

                        {/* in entities fieldname is table_name e.g. 
                            t::orders: Array(5)
                                0: "f::ORDER_NR"
                                1: "f::PRODUCT_ID"
                                2: "f::USER_ID"
                                3: "f::QUANTITY"
                                4: "f::CONFIRM_ORDER" */}
                        {M_Class_Name === "entities" && (
                            <EntityField
                                field_data={field_data}
                                table_name={fieldname}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
