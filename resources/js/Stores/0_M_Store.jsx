// resources/js/Stores/0_M_Store.jsx

import { create } from "zustand";
import JSON_Content from "../Components/0_M_JSON_Content";

/**
 * M_States Registry
 * * Stores all class data dynamically per fieldname
 * * M_States: {
 * * "f::NAME":  ['name', d::STRING , u::TEXT , cud::REQUIRED],
 * * "f::PRICE": ['price', [d::DECIMAL, 10, 2], u::NUMBER, [cd::DEFAULT, 0], s::CURRENCY]
 * * }
 */
export const use_M_Store = create((set) => ({
    debug: true,
    activeTab: "m_data",
    setActiveTab: (tab) => set({ activeTab: tab }),

    activeField: null,
    setActiveField: (field) => set({ activeField: field }),

    activeSubTab: "d",
    setActiveSubTab: (subTab) => set({ activeSubTab: subTab }),

    JSON_Content_State: null,
    setJSON_Content_State: (JSON_Content) =>
        set({ JSON_Content_State: JSON_Content }),

    // // e.g ['cd::DEFAULT', 10, 2]
    // DEFAULT_Panel: [],
    // set_DEFAULT_Panel: (arrayValue) => set({ DEFAULT_Panel: arrayValue }),

    M_States: {},
    unset_States: () => set({ M_States: {} }),
    /**
     * * Update state for a given fieldname and its metadata values
     * * we must cleanData before nextStates
     * * to show actuel data in M_States
     * * PARAMS:
     * * fieldname: "f::PRICE"
     * * M_value: all existing f:: in App_data.json { NAME[], PRICE[], ...}
     */
    setFocus: (fieldname, M_value) =>
        set((state) => {
            const cleanData = M_value[fieldname]
                ? { [fieldname]: M_value[fieldname] }
                : M_value;

            const nextStates = {
                [fieldname]: {
                    ...cleanData,
                },
            };

            if (state.debug) {
                console.log(`[M_STORE_DEBUG] Focused on: ${fieldname}`);
                console.log(`[M_STORE_DEBUG] Current M_States:`, nextStates);
                console.log("------------------------------------");
            }

            return { M_States: nextStates };
        }),

    /**
     * * M_value = all Data from each json file
     * * it depends on which Main Tab in Dashboard you clicked
     * * e.g. M_DATA, APP_DATA, ENTITIES
     */
    M_value: {},
    set_M_value: (new_M_value) =>
        set((state) => {
            if (state.debug) {
                console.log(`[M_STORE_DEBUG] M_value updated!`);
                console.log(`[M_STORE_DEBUG] New M_value:`, new_M_value);
                console.log("------------------------------------");
            }
            return { M_value: new_M_value };
        }),
}));
