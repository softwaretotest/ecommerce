// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";
import { useError } from "@/Hooks/useError";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import {
    M_value_Service,
    add_cascade_tablename_in_app_data_t,
} from "@/Services/0_M_value_Service";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";
import { get_D_NAME, get_U_NAME } from "@/Components/0_M_Data_Helper";
import { set_selected_D_U_FOREIGN } from "@/Components/0_M_Data_Helper";

export default function TabContent() {
    const { Error_FIELDNAME, handle_Fieldname_Change } = useError();

    const { FIELDNAME_to_add, set_FIELDNAME_to_add } = use_M_Store();

    // const M_value = use_M_Store((state) => state.M_value);
    const M_value = use_M_Store.getState().M_value;
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeSubTab = use_M_Store((state) => state.activeSubTab);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);
    const is_Editing = use_M_Store((state) => state.is_Editing);

    const set_NEW_added_fieldname =
        use_M_Store.getState().set_NEW_added_fieldname;

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
                // for update fielname , user must select a field first
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
                        TABLENAME={fieldname.toUpperCase()}
                    />
                )}
            </div>
        );
    }

    /**
     * * get new fieldname from UI
     * * and save to JSON Backend
     * * BE CAREFULL to save convention : always like this
     * * fieldname = lowercase
     * * M_value [KEY] , KEY = UPPERCASE
     * @returns
     */
    async function add_field_ENTITIES() {
        const set_selected_F_S = use_M_Store.getState().set_selected_F_S;

        const input_box_fieldname = document.querySelector(".new_field_name");
        const raw_name = input_box_fieldname ? input_box_fieldname.value : "";

        const trimmed_name = raw_name.trim();
        if (!trimmed_name) return;

        const fieldname = trimmed_name;
        const M_value_KEY = fieldname.toUpperCase();
        console.log(
            "[A] !!!!!!!! TabContent -- add_field_ENTITIES --- M_value_KEY = ",
            M_value_KEY,
        );
        console.log(
            "[B] !!!!!!!! TabContent -- add_field_ENTITIES --- old M_value = ",
            use_M_Store.getState().M_value,
        );

        // // this add empty []  -- OLD Solution without Loop -------NOT WORK -------------
        // const new_M_value = {
        //     [M_value_KEY]: [],
        //     ...use_M_Store.getState().M_value,
        // };

        // add empty place for new seleted_F_S
        set_selected_F_S(M_value_KEY, []);

        // const new_M_value = { ...use_M_Store.getState().M_value };
        const new_M_value = {};
        console.log(
            "[5] !!!!!!!!!!! -- TabContent -- update_M_value_with_selected_F_S -- new_M_value = ",
            new_M_value,
        );

        console.log(
            `[6] !!!!!!!!!!! -- TabContent -- update_M_value_with_selected_F_S -- selected_F_S[${M_value_KEY}] = `,
            use_M_Store.getState().selected_F_S[M_value_KEY],
        );

        /**
         * * WORKAROUND : BUG M_value[M_VALUE_KEY] = undefined
         * * we Loop to build new_M_value by copy content from selected_F_S ,
         * * because if we use clone ...M_value ,
         * * M_value[M_value_KEY] it has alle M empty content ,
         * * BUG = empty content of all table
         * * -------------------------------
         * * SOLUTION : seleted_F_S = Entities on UI
         * * we keep seleted_F_S correct on the whole CRUD - Flow
         * * so seleted_F_S can be save backend as M_value anytime
         */
        for (const TABLENAME of Object.keys(
            use_M_Store.getState().selected_F_S,
        )) {
            // get current data before save
            new_M_value[TABLENAME] =
                use_M_Store.getState().selected_F_S[TABLENAME];
        }

        console.log(
            "[7] !!!!!!!!!!! -- TabContent -- update_M_value_with_selected_F_S -- new_M_value = ",
            new_M_value,
        );

        await M_value_Service.update(new_M_value);

        if (fieldname) setActiveField(fieldname.toLowerCase()); // for auto scroll, not work

        // this make auto scroll for JSON_Content works if new field added
        use_M_Store.getState().set_is_new_field_added(true);

        //clear input box , after finish
        if (input_box_fieldname) input_box_fieldname.value = "";
        set_FIELDNAME_to_add("");

        await add_cascade_tablename_in_app_data_t(
            use_M_Store.getState().activeField,
        );
    }

    /**
     * * get new fieldname from UI
     * * and save to JSON Backend
     * * BE CAREFULL to save convention : always like this
     * * fieldname = lowercase
     * * M_value [KEY] , KEY = UPPERCASE
     * @returns
     */
    async function add_field_APP_DATA() {
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
        set_FIELDNAME_to_add("");

        set_selected_D_U_FOREIGN(new_field_data);
    }

    function add_field() {
        if (
            (activeTab === "app_data" && activeSubTab === "f") ||
            (activeTab === "m_data" && activeSubTab === "s")
        ) {
            add_field_APP_DATA();
        }
        if (activeTab === "entities" && activeSubTab === "entities") {
            add_field_ENTITIES();
        }
    }

    /**
     * remove scroll to lock UI during editing
     */
    useEffect(() => {
        if (is_Editing) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [is_Editing]);

    return (
        <>
            {Error_FIELDNAME}

            <div className="tab-content-header">
                <label className="tch-label">
                    activeSubTab = {activeSubTab}
                </label>
                <input
                    type="text"
                    className={`new_field_name ${FIELDNAME_to_add ? "justify-items-center" : ""}`}
                    placeholder="new field name"
                    value={FIELDNAME_to_add}
                    onFocus={() => set_FIELDNAME_to_add("")}
                    onChange={(event) => handle_Fieldname_Change(event)}
                />

                <button
                    className="add-button"
                    onClick={() => {
                        add_field();
                    }}
                    //no continue, if no data , or data invalide
                    disabled={!FIELDNAME_to_add}
                >
                    ADD FIELD
                </button>
            </div>

            <div
                className={`input-engine-container ${use_M_Store.getState().is_Editing ? "lock-scroll" : ""}`}
            >
                {use_M_Store.getState().is_Editing && (
                    <div className="backdrop" />
                )}
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
