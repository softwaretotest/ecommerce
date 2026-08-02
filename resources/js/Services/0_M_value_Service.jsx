// /Resources/Services/0_M_value_Service.jsx
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { API } from "@/Configs/api";

import { change_fieldname_in_field_data } from "@/Components/0_M_Data_Helper";
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { findout_F_or_S } from "@/Providers/0_M_DataProvider";

/**
 * * EXPLAIN M_value = { Object }
 * * M_value has same format like JSON to simplify convertion
 * * ------------------------------------------
 * * CONVENTION
 * *{ M_value_KEY: [ fieldname , ...field_definition] }
 * * field_data  = [ fieldname , ...field_definition]
 * * M_value_KEY <=> fieldname
 * * UPPPERCASE  <=> lowercase
 * * e.g.
 * * {"IMAGE": [ "image", ["d::STRING" , 255] , "u::FILE"]}
 * * ------------------------------------------
 * * function of M_value_Service
 * 0. save M_value to Global States M_Store
 * 1. POST to Backend
 * 2. notify use_M_Data to notify JSON_Content to update it self with Backend
 *
 * @param {*} new_M_value
 * * activeTab  subTab
 * * M-DATA     CD D U CU CUD S
 * * APP-DATA   F T
 * * ENTITIES   ENTITIES
 */
export const M_value_Service = {
    update: async (new_M_value, cascade = null) => {
        const set_M_value = use_M_Store.getState().set_M_value;
        const set_has_M_value_Change =
            use_M_Store.getState().set_has_M_value_Change;

        // 0. save M_value to Global States M_Store
        if (!cascade) {
            await set_M_value(new_M_value);
        }

        try {
            /**
             *  1. POST to Backend
             * * need await for try-catch
             * * and send_POST must 100% finish
             * * before set_has_M_value_Change (to tell JSON_Conten to get Backend data)
             */
            await send_POST(new_M_value, cascade);

            // 2. notify use_M_Data to notify JSON_Content to update it self with Backend
            set_has_M_value_Change(true);
        } catch (error) {
            console.error("[SERVICE] Error saving:", error);
        }
    },
};

async function send_POST(new_M_value, cascade = null) {
    const activeTab = use_M_Store.getState().activeTab;
    const activeSubTab = use_M_Store.getState().activeSubTab;
    const response = await fetch(API.M_VALUE_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
        body: JSON.stringify({
            tab: cascade ? cascade.activeTab : activeTab,
            subTab: cascade ? cascade.activeSubTab : activeSubTab,
            data: new_M_value,
        }),
    });

    if (!response.ok) throw new Error("Server error");

    console.log(`[SERVICE] Saved ${activeTab}/${activeSubTab} successfully!`);
}

/**
 * this to solve problem , content = null
 * * headers: {
 * *   "Content-Type": "application/json",
 * *    "X-CSRF-TOKEN": document.querySelector(
 * *        'meta[name="csrf-token"]',
 * *    ).content, // important!
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

/**
 * * CALLED by onClick DELETE-Button of activeField
 * * ----------------------------------------
 * 1. setActiveField(fieldname) if activeField !== fieldname
 * * and return to let hightlightk first for user
 * * to see, that this field is active
 * * ----------------------------------------
 * 2.remove the active field from M_value
 * * and update JSON Backend
 */
export async function delete_field(fieldname) {
    const debug = true;

    const activeTab = use_M_Store.getState().activeTab;
    const activeSubTab = use_M_Store.getState().activeSubTab;
    const activeField = use_M_Store.getState().activeField;
    const setActiveField = use_M_Store.getState().setActiveField;
    if (activeField !== fieldname) {
        console.log(`${activeField} === ${fieldname}`);
        setActiveField(fieldname);
        return;
    }

    const FIELDNAME = activeField.toUpperCase();

    const isConfirmed = window.confirm(`Are you sure to delete ${FIELDNAME}?`);
    if (isConfirmed) {
        const new_M_value = { ...use_M_Store.getState().M_value };

        //delete object(M_value)'s item by KEY(FIELDNAME)
        delete new_M_value[FIELDNAME];

        await M_value_Service.update(new_M_value);

        if (
            (activeTab === "app_data" && activeSubTab === "f") || // Field
            (activeTab === "m_data" && activeSubTab === "s") // SpecialField
        ) {
            await delete_cascade_fieldname_in_entities(activeField, debug);
        }

        if (activeTab === "entities" && activeSubTab === "entities") {
            await delete_cascade_tablename_in_app_data_t(activeField, debug);
        }
    }
}

/**
 * * CALLED after app_data t::CLASS tablename in ENTITIES added
 * * to add cascade tablename in Entities.json
 * @param {*} activeField e.g. image123
 */
export async function add_cascade_tablename_in_app_data_t(activeField) {
    const M_value_T = GLOBAL_METADATA?.app_data?.t;

    if (!M_value_T) return;

    const new_M_value_T = { ...M_value_T };
    new_M_value_T[activeField.toUpperCase()] = activeField;

    console.log(`[SERVICE] -- new_M_value_T:`, new_M_value_T);

    const cascade = {
        activeTab: "app_data",
        activeSubTab: "t",
    };

    await M_value_Service.update(new_M_value_T, cascade);
}

/**
 * * CALLED after app_data f::CLASS fieldname deleted
 * * to delete cascade fieldname in Entities.json, if f:: usage exists there
 * @param {*} activeField e.g. image123
 */
async function delete_cascade_tablename_in_app_data_t(activeField, debug) {
    const M_value_T = GLOBAL_METADATA?.app_data?.t;

    if (!M_value_T) return;

    const new_M_value_T = { ...M_value_T };
    delete new_M_value_T[activeField.toUpperCase()];

    if (debug) console.log(`[5][SERVICE] -- new_M_value_T:`, new_M_value_T);

    const cascade = {
        activeTab: "app_data",
        activeSubTab: "t",
    };

    await M_value_Service.update(new_M_value_T, cascade);
}

/**
 * * CALLED after app_data f::CLASS fieldname deleted
 * * to delete cascade fieldname in Entities.json, if f:: usage exists there
 * @param {*} activeField e.g. IMAGE123
 */
async function delete_cascade_fieldname_in_entities(activeField, debug) {
    const entities = GLOBAL_METADATA?.entities?.entities;
    const FIELDNAME = activeField.toUpperCase();
    const f_s_CLASS = findout_F_or_S(FIELDNAME); // ได้ค่าตรงฟอร์แมต เช่น "f::IMAGE123" มาทันที

    if (debug)
        console.log(
            `[1][SERVICE -- delete_cascade] -- activeField: ${activeField}`,
        );
    if (debug)
        console.log(`[2][SERVICE -- delete_cascade] -- entities:`, entities);

    if (!entities) return;

    const new_M_value_Entities = {};

    // LOOP TO find f_CLASS in all entities[TABLENAME]
    for (const table in entities) {
        const fields = entities[table];
        if (debug)
            console.log(`[2.0][SERVICE -- delete_cascade] -- table: ${table}`);

        // กรองเอา field ที่ตรงกับ f_s_CLASS ออกตรงๆ ได้เลย
        const new_fields = fields.filter((field) => {
            const isMatch = field === f_s_CLASS;
            if (isMatch && debug) {
                console.log(
                    `[3.2][SERVICE -- delete_cascade] -- Removed matched field: ${field} from table: ${table}`,
                );
            }
            return !isMatch;
        });

        if (debug)
            console.log(
                `[4][SERVICE -- delete_cascade] -- New fields for ${table}:`,
                new_fields,
            );
        new_M_value_Entities[table] = new_fields;
    }

    if (debug)
        console.log(
            `[5][SERVICE -- delete_cascade] -- new_M_value_Entities:`,
            new_M_value_Entities,
        );

    const cascade = {
        activeTab: "entities",
        activeSubTab: "entities",
    };

    await M_value_Service.update(new_M_value_Entities, cascade);
}

/**
 * * to rename M_value_KEY and fieldname
 * * and keep same sort-order ,
 * @param {*} old_M_value
 * * e.g. { IMAGE : ['image' , ['d::STRING',255] , 'u::FILE ] ... }
 * @param {*} OLD_KEY e.g. IMAGE
 * @param {*} NEW_KEY e.go PRODUCT_IMAGE
 * @returns new_M_value
 * * e.g. { PRODUCT_IMAGE : ['product_image' , ['d::STRING',255] , 'u::FILE ] ... }
 * * ---------------------------------------
 * * MY OPINION:
 * * we have to make new_M_value und loop all field from old_M_value
 * * This effort is insane !!!
 * * Because, we auto. save M_value to backend onChange of fieldname
 * * that means, we loops all fields every time we type a letter
 * * we have 2026 , but GEMINI said :
 * * " JS still has no better solution to change object key "
 */
export async function rename_M_value_KEY_and_fieldname(
    old_M_value,
    OLD_KEY,
    NEW_KEY,
) {
    const debug = true;

    const activeTab = use_M_Store.getState().activeTab;
    const activeSubTab = use_M_Store.getState().activeSubTab;
    const setActiveField = use_M_Store.getState().setActiveField;
    const set_NEW_added_fieldname =
        use_M_Store.getState().set_NEW_added_fieldname;
    const set_has_Fieldname_Change =
        use_M_Store.getState().set_has_Fieldname_Change;

    const new_M_value = prepare_M_value_for_update_f_s_entities(
        old_M_value,
        OLD_KEY,
        NEW_KEY,
        debug,
    );

    setActiveField(NEW_KEY.toLowerCase());
    set_NEW_added_fieldname(NEW_KEY.toLowerCase());
    set_has_Fieldname_Change(true);
    await M_value_Service.update(new_M_value);

    if (
        (activeTab === "app_data" && activeSubTab === "f") ||
        (activeTab === "m_data" && activeSubTab === "s")
    ) {
        await update_cascade_fieldname_in_entities(OLD_KEY, NEW_KEY, debug);
    }

    if (activeTab === "entities" && activeSubTab === "entities") {
        await update_cascade_tablename_in_app_data_t(OLD_KEY, NEW_KEY, debug);
    }
}

/**
 * * CALLED after entities TABLENAME changed
 * * to update cascade tablename in App-Data.json (under 't' subTab)
 * @param {*} OLD_TABLENAME e.g. "ORDERS"
 * @param {*} NEW_TABLENAME e.g. "ORDERS_NEW"
 */

/**
 * * CALLED after entities TABLENAME changed
 * * to update cascade tablename in App-Data.json (under 't' subTab)
 * @param {*} OLD_KEY e.g. "ORDERS"
 * @param {*} NEW_KEY e.g. "ORDERS_NEW"
 */
async function update_cascade_tablename_in_app_data_t(OLD_KEY, NEW_KEY, debug) {
    const M_value_T = GLOBAL_METADATA?.app_data?.t;
    if (debug) console.log(`[0][SERVICE] M_value_T:`, M_value_T);

    if (debug)
        console.log(`[1][SERVICE] -- OLD_KEY: ${OLD_KEY}, NEW_KEY: ${NEW_KEY}`);

    if (!M_value_T) return;

    const new_M_value_T = {};

    for (const KEY of Object.keys(M_value_T)) {
        const value = M_value_T[KEY];
        if (debug) console.log(`[2][SERVICE] -- KEY: ${KEY}, value: ${value}`);

        if (KEY === OLD_KEY) {
            new_M_value_T[NEW_KEY] = NEW_KEY.toLowerCase();
        } else {
            new_M_value_T[KEY] = value;
        }
    }

    if (debug) console.log(`[5][SERVICE] -- new_M_value_T:`, new_M_value_T);

    const cascade = {
        activeTab: "app_data",
        activeSubTab: "t",
    };

    await M_value_Service.update(new_M_value_T, cascade);
}

function prepare_M_value_for_update_f_s_entities(
    old_M_value,
    OLD_KEY,
    NEW_KEY,
) {
    const new_M_value = {};
    for (const KEY of Object.keys(old_M_value)) {
        if (OLD_KEY === NEW_KEY) return old_M_value;
        if (KEY === OLD_KEY) {
            const old_field_data = old_M_value[OLD_KEY];

            const activeTab = use_M_Store.getState().activeTab;
            const activeSubTab = use_M_Store.getState().activeSubTab;

            if (activeTab === "entities" && activeSubTab === "entities") {
                new_M_value[NEW_KEY] = old_field_data;
            } else {
                /**
                 * * case app_data f::CLASS or s::SPECIAL_FIELD
                 * * must change fieldname in field_data too
                 * * M_value_KEY <=> fieldname
                 * * UPPPERCASE  <=> lowercase
                 * * e.g.
                 * * {"IMAGE": [ "image", ["d::STRING" , 255] , "u::FILE"]}
                 * * {"PRODUCT_IMAGE": [ "product_image", ["d::STRING" , 255] , "u::FILE"]}
                 */
                const M_value_with_new_fieldname =
                    change_fieldname_in_field_data(
                        old_field_data,
                        NEW_KEY.toLowerCase(),
                    );
                new_M_value[NEW_KEY] = M_value_with_new_fieldname;
            }
        } else {
            new_M_value[KEY] = old_M_value[KEY];
        }
    }
    return new_M_value;
}

/**
 * * CALLED after app_data f::CLASS fieldname changed
 * * to update cascade fieldname in Entities.json, if f:: usage exists there
 * @param {*} OLD_KEY e.g. IMAGE
 * @param {*} NEW_KEY e.g. PRODUCT_IMAGE
 */
async function update_cascade_fieldname_in_entities(OLD_KEY, NEW_KEY, debug) {
    const entities = GLOBAL_METADATA?.entities?.entities;

    if (debug)
        console.log(`[1][SERVICE] -- OLD_KEY: ${OLD_KEY}, NEW_KEY: ${NEW_KEY}`);
    if (debug) console.log(`[2][SERVICE] entities:`, entities);

    const new_M_value_Entities = {};

    for (const table in entities) {
        const fields = entities[table];
        if (debug) console.log(`[2.0][SERVICE] -- table: ${table}`);
        if (debug) console.log(`[2.1][SERVICE] -- fields: ${fields}`);
        const new_fields = fields.map((field) => {
            // for fields e.g. f::NAME, f::IMAGE, f::USER_ID
            if (field === "f::" + OLD_KEY) {
                return "f::" + NEW_KEY;
            }
            // for Special fields e.g. s::EMAIL, s::CURRENCY
            if (field === "s::" + OLD_KEY) {
                return "s::" + NEW_KEY;
            }
            if (debug)
                console.log(
                    `[3.2][SERVICE] -- field: ${field} === ${"f::" + OLD_KEY}`,
                );
            return field;
        });
        if (debug) console.log(`[4][SERVICE] -- New fields:`, new_fields);
        new_M_value_Entities[table] = new_fields;
    }

    if (debug)
        console.log(
            `[5][SERVICE] -- new_M_value_Entities:`,
            new_M_value_Entities,
        );
    const cascade = {
        activeTab: "entities",
        activeSubTab: "entities",
    };
    await M_value_Service.update(new_M_value_Entities, cascade);
}

/**
 * * CALLED by EntitiyField.jsx and Entities_select.jsx
 * * to update M_value with selected_F_S for current TABLENAME
 * @param {*} TABLENAME e.g. ORDERS , PRODUCTS
 */
export async function update_M_value_with_selected_F_S(TABLENAME) {
    const selected_F_S = use_M_Store.getState().selected_F_S;
    const M_value = use_M_Store.getState().M_value;

    /**
     * clone M_value and overwrite
     * where M_value_KEY = TABLENAME
     * with new field_data = selected_F_S
     */
    const new_M_value = {
        ...M_value,
        [TABLENAME]: selected_F_S[TABLENAME],
    };

    await M_value_Service.update(new_M_value, {
        activeTab: "entities",
        activeSubTab: "entities",
    });
}
