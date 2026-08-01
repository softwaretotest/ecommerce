// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";
import { useError } from "@/Hooks/useError";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { M_value_Service } from "@/Services/0_M_value_Service";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";
import { get_D_NAME, get_U_NAME } from "@/Components/0_M_Data_Helper";
import { set_selected_D_U_FOREIGN } from "@/Components/0_M_Data_Helper";

export default function TabContent() {
    const { Error_FIELDNAME, handle_Fieldname_Change } = useError();

    const M_value = use_M_Store((state) => state.M_value);
    const NEW_added_fieldname = use_M_Store(
        (state) => state.NEW_added_fieldname,
    );

    const set_NEW_added_fieldname = use_M_Store(
        (state) => state.set_NEW_added_fieldname,
    );
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeSubTab = use_M_Store((state) => state.activeSubTab);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    if (!M_value)
        return <div className="ui-placeholder">No UI for {activeSubTab}</div>;

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
                onClick={() => {
                    // fieldname = null , when field deleted
                    if (fieldname) setActiveField(fieldname);
                }}
                disabled={!activeField}
            >
                {["d", "u", "cd", "cu", "cud"].includes(activeSubTab) && (
                    <>
                        <input
                            className="M_value_KEY"
                            defaultValue={
                                activeSubTab === "t"
                                    ? fieldname
                                    : fieldname.toUpperCase()
                            }
                        />
                        <span className="field-separator-colon">:</span>
                        <input
                            type="text"
                            className="fieldname"
                            defaultValue={field_data}
                        />
                    </>
                )}

                {activeSubTab === "s" && Array.isArray(field_data) && (
                    <SpecialField field_data={field_data} />
                )}
                {activeSubTab === "f" && Array.isArray(field_data) && (
                    <Field field_data={field_data} />
                )}
                {activeSubTab === "t" && (
                    <DB_Tablename field_data={field_data} />
                )}
                {activeSubTab === "entities" && (
                    <EntityField
                        f_s_Class_Array={field_data}
                        tablename={fieldname.replace("t::", "").toUpperCase()}
                    />
                )}
            </div>
        );
    }

    const [new_FIELDNAME, set_new_FIELDNAME] = useState("");
    /**
     * * get new fieldname from UI
     * * and save to JSON Backend
     * * BE CAREFULL to save convention : always like this
     * * fieldname = lowercase
     * * M_value [KEY] , KEY = UPPERCASE
     * @returns
     */
    async function add_field() {
        const input_box_fieldname = document.querySelector(".new_field_name");
        const raw_name = input_box_fieldname ? input_box_fieldname.value : "";

        const trimmed_name = raw_name.trim();
        if (!trimmed_name) return;

        await set_NEW_added_fieldname(trimmed_name.toLowerCase()); //set flag for useEffect in Dropdown_D.jsx

        const new_field_data = [trimmed_name.toLowerCase(), ["d::STRING", 255]];
        const fieldname = new_field_data[0];
        const M_value_KEY = new_field_data[0].toUpperCase();

        const new_M_value = {
            [M_value_KEY]: new_field_data,
            ...M_value,
        };

        await M_value_Service.update(new_M_value);
        if (fieldname) await setActiveField(fieldname); // for auto scroll, not work
        // this make auto scroll for JSON_Content works if new field added
        use_M_Store.getState().set_is_new_field_added(true);

        //clear input box , after finish
        if (input_box_fieldname) input_box_fieldname.value = "";
        set_new_FIELDNAME("");

        set_selected_D_U_FOREIGN(new_field_data);
    }

    return (
        <>
            <div className="tab-content-header">
                <label className="tch-label">
                    activeSubTab = {activeSubTab}
                </label>
                <input
                    type="text"
                    className={`new_field_name ${new_FIELDNAME ? "justify-items-center" : ""}`}
                    placeholder="new field name"
                    value={new_FIELDNAME}
                    onChange={(event) =>
                        handle_Fieldname_Change(
                            event.target.value,
                            set_new_FIELDNAME,
                            { ADD: true },
                        )
                    }
                />

                {Error_FIELDNAME}

                <button
                    className="add-button"
                    onClick={add_field}
                    disabled={!new_FIELDNAME || Error_FIELDNAME}
                >
                    ADD FIELD
                </button>
            </div>

            <div className="input-engine-container">
                {Object.entries(M_value).map(
                    ([M_value_KEY, field_data], index) => {
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
                        return render_TabContent_DOM(
                            M_value_KEY.toLowerCase(),
                            field_data,
                        );
                    },
                )}
            </div>
        </>
    );
}
