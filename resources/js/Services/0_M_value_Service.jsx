// /Resources/Services/0_M_value_Service.jsx
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { API } from "@/Configs/api";

import { change_fieldname_in_field_data } from "@/Components/0_M_Data_Helper";

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
    update: async (new_M_value) => {
        const set_M_value = use_M_Store.getState().set_M_value;
        const set_has_M_value_Change =
            use_M_Store.getState().set_has_M_value_Change;

        // 0. save M_value to Global States M_Store
        const result = await set_M_value(new_M_value);

        try {
            /**
             *  1. POST to Backend
             * * need await for try-catch
             * * and send_POST must 100% finish
             * * before set_has_M_value_Change (to tell JSON_Conten to get Backend data)
             */
            await send_POST(new_M_value);

            // 2. notify use_M_Data to notify JSON_Content to update it self with Backend
            set_has_M_value_Change(true);

            return result;
        } catch (error) {
            console.error("[SERVICE] Error saving:", error);
        }
    },
};

async function send_POST(new_M_value) {
    const activeTab = use_M_Store.getState().activeTab;
    const activeSubTab = use_M_Store.getState().activeSubTab;
    const response = await fetch(API.M_VALUE_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
        body: JSON.stringify({
            tab: activeTab,
            subTab: activeSubTab,
            data: new_M_value,
        }),
    });

    if (!response.ok) throw new Error("Server error");

    const result = await response.json();

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
    if (OLD_KEY === NEW_KEY) return old_M_value;

    const set_has_Fieldname_Change =
        use_M_Store.getState().set_has_Fieldname_Change;
    const setActiveField = use_M_Store.getState().setActiveField;
    const set_NEW_added_fieldname =
        use_M_Store.getState().set_NEW_added_fieldname;

    const new_M_value = {};

    for (const KEY of Object.keys(old_M_value)) {
        if (KEY === OLD_KEY) {
            const old_field_data = old_M_value[OLD_KEY];
            const M_value_with_new_fieldname = change_fieldname_in_field_data(
                old_field_data,
                NEW_KEY.toLowerCase(),
            );
            new_M_value[NEW_KEY] = M_value_with_new_fieldname;
        } else {
            new_M_value[KEY] = old_M_value[KEY];
        }
    }
    // return new_M_value;

    setActiveField(NEW_KEY.toLowerCase());
    set_NEW_added_fieldname(NEW_KEY.toLowerCase());
    set_has_Fieldname_Change(true);
    await M_value_Service.update(new_M_value);
}
