// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";

export default function TabContent({ M_Class_Name }) {
    const M_value = use_M_Store((state) => state.M_value);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    if (!M_value)
        return <div className="ui-placeholder">No UI for {M_Class_Name}</div>;

    const scrollRefs = useRef({});

    // defind Javascript GLOBAL Variable window.D_HEALING if not exist
    if (typeof window !== "undefined" && !window.D_HEALING) {
        window.D_HEALING = { isLastField: false, total: 0, collected: {} };
    }

    useEffect(() => {
        const entries = Object.entries(M_value);
        window.D_HEALING.total = entries.length;
    }, [M_value]);

    function render_TabContent_DOM(fieldname, field_data) {
        return (
            <div
                key={fieldname}
                ref={(DOM_Node) => (scrollRefs.current[fieldname] = DOM_Node)}
                className={`form-subtab-content-row ${activeField === fieldname ? "is-focused" : ""}`}
                onClick={() => setActiveField(fieldname)}
            >
                {["d", "u", "cd", "cu", "cud"].includes(M_Class_Name) && (
                    <>
                        <input
                            className="M_Data_KEY"
                            defaultValue={
                                M_Class_Name === "t"
                                    ? fieldname
                                    : fieldname.toUpperCase()
                            }
                        />
                        <span className="field-separator-colon">:</span>
                        <input
                            type="text"
                            className="M_Data_VALUE"
                            defaultValue={field_data}
                        />
                    </>
                )}

                {M_Class_Name === "s" && Array.isArray(field_data) && (
                    <SpecialField field_data={field_data} />
                )}
                {M_Class_Name === "f" && Array.isArray(field_data) && (
                    <Field field_data={field_data} M_value={M_value} />
                )}
                {M_Class_Name === "t" && (
                    <DB_Tablename field_data={field_data} />
                )}
                {M_Class_Name === "entities" && (
                    <EntityField
                        field_data={field_data}
                        table_name={fieldname}
                    />
                )}
            </div>
        );
    }
    return (
        <>
            <div>
                <label>M_Class_Name = {M_Class_Name}</label>
            </div>
            <div className="input-engine-container">
                {Object.entries(M_value).map(
                    ([fieldname, field_data], index) => {
                        // SAVE TO Javascript GLOBAL Variable
                        const isLastField =
                            index === Object.entries(M_value).length - 1;
                        window.D_HEALING.isLastField = isLastField;
                        console.log(
                            " TabContent - window.D_HEALING.isLastField = ",
                            window.D_HEALING.isLastField,
                        );
                        // !!! MUST HAVE return to show DOM !!!
                        return render_TabContent_DOM(fieldname, field_data);
                    },
                )}
            </div>
        </>
    );
}
