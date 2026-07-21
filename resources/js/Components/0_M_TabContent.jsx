// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { M_value_Service } from "@/Services/0_M_value_Service";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";

export default function TabContent({ M_Class_Name }) {
    const M_value = use_M_Store((state) => state.M_value);
    const NEW_fieldname = use_M_Store((state) => state.NEW_fieldname);
    const set_NEW_fieldname = use_M_Store((state) => state.set_NEW_fieldname);
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    if (!M_value)
        return <div className="ui-placeholder">No UI for {M_Class_Name}</div>;

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    // define Javascript GLOBAL Variable window.D_HEAL if not exist
    if (typeof window !== "undefined" && !window.D_HEAL) {
        window.D_HEAL = { isLastField: false, total: 0, collected: {} };
    }

    function render_TabContent_DOM(fieldname, field_data) {
        return (
            <div
                key={fieldname}
                ref={(DOM_Node) => (scrollRefs.current[fieldname] = DOM_Node)}
                className={`form-subtab-content-row ${activeField === fieldname ? "is-focused" : ""}`}
                onClick={() => setActiveField(fieldname)}
                readOnly={!activeField}
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
                        f_s_Class_Array={field_data}
                        table_name={fieldname}
                    />
                )}
            </div>
        );
    }

    function check_duplicate_in_M_value(new_fieldname) {
        const target = new_fieldname.trim().toUpperCase();
        const has_same_fieldname = Object.keys(M_value).some(
            (key) => key.toUpperCase() === target,
        );
        return has_same_fieldname;
    }

    /**
     * * get new fieldname from UI
     * * and save to JSON Backend
     * @returns
     */
    async function add_field() {
        const input_box_fieldname = document.querySelector(".input_fieldname");
        const raw_name = input_box_fieldname ? input_box_fieldname.value : "";

        const trimmed_name = raw_name.trim();
        if (!trimmed_name) return;

        await set_NEW_fieldname(trimmed_name); //set flag for useEffect in Dropdown_D.jsx

        const field_data = [trimmed_name, ["d::STRING", 255]];
        const FIELDNAME = field_data[0].toUpperCase();

        const new_M_value = {
            [FIELDNAME]: field_data,
            ...M_value,
        };

        await M_value_Service.update(new_M_value);
        setActiveField(FIELDNAME); // for auto scroll

        //clear input box , after finish
        if (input_box_fieldname) input_box_fieldname.value = "";
        set_new_FIELDNAME("");
    }

    const [new_FIELDNAME, set_new_FIELDNAME] = useState("");
    const [Error_NEW_FIELDNAME, set_Error_NEW_FIELDNAME] = useState("");
    function handleFieldnameChange(value) {
        set_new_FIELDNAME(value);

        if (!value.trim()) {
            set_Error_NEW_FIELDNAME("Fieldname cannot be empty.");
            return;
        }

        const isDuplicate =
            M_value && Object.keys(M_value).includes(value.trim());

        if (isDuplicate) {
            set_Error_NEW_FIELDNAME("This field name already exists.");
        } else {
            set_Error_NEW_FIELDNAME(""); // clear if no error
        }
    }
    return (
        <>
            <div className="tab-content-header">
                <label className="tch-label">
                    M_Class_Name = {M_Class_Name}
                </label>
                <input
                    type="text"
                    className="input_fieldname"
                    placeholder="new field name"
                    value={new_FIELDNAME}
                    onChange={(e) =>
                        handleFieldnameChange(e.target.value.toUpperCase())
                    }
                />

                {Error_NEW_FIELDNAME && (
                    <span className="error-text">{Error_NEW_FIELDNAME}</span>
                )}

                <button
                    className="add-button"
                    onClick={add_field}
                    disabled={!new_FIELDNAME || Error_NEW_FIELDNAME}
                >
                    ADD FIELD
                </button>
            </div>

            <div className="input-engine-container">
                {Object.entries(M_value).map(
                    ([fieldname, field_data], index) => {
                        // SAVE TO Javascript GLOBAL Variable
                        // Dropdown_D run D_HEAL only
                        // after refresh and activeTab = app_data
                        if (
                            !window.D_HEAL.isLastField &&
                            activeTab === "app_data"
                        ) {
                            let isLastField =
                                index === Object.entries(M_value).length - 1;
                            window.D_HEAL.isLastField = isLastField;
                        }
                        // !!! MUST HAVE return to show DOM !!!
                        return render_TabContent_DOM(fieldname, field_data);
                    },
                )}
            </div>
        </>
    );
}
