// /Resources/Services/0_M_value_Service.jsx
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { API } from "@/Configs/api";

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
            // 1. POST to Backend
            await send_POST(new_M_value);

            // 2. notify use_M_Data to notify JSON_Content to update it self with Backend
            await set_has_M_value_Change(true);

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
