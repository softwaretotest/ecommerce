// resources/js/Stores/0_M_Store.jsx

import { create } from "zustand";

export const use_M_Store = create((set) => ({
    debug: false,
    debug_selected_U: true,
    debug_selected_D: true,
    debug_checked_CU: false,
    debug_checked_CD: false,
    debug_M_value: false,
    debug_activeField: false,
    debug_activeTab: false,
    debug_activeSubTab: false,
    debug_activeField: false,

    selected_D: {}, // atomic states
    set_selected_D: (fieldname, selected_D_Value) =>
        set((state) => {
            if (!fieldname) return { selected_D: {} };

            const NEW_selected_D = {
                ...state.selected_D,
                [fieldname]: selected_D_Value,
            };

            if (state.debug || state.debug_selected_D) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_D[${fieldname}]:`,
                    NEW_selected_D[fieldname],
                );
                console.log("------------------------------------");
            }

            return { selected_D: NEW_selected_D };
        }),

    selected_U: {}, // atomic states
    set_selected_U: (fieldname, selected_U_Value) =>
        set((state) => {
            if (!fieldname) return { selected_U: {} };

            const NEW_selected_U = {
                ...state.selected_U,
                [fieldname]: selected_U_Value,
            };

            if (state.debug || state.debug_selected_U) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_U[${fieldname}]:`,
                    NEW_selected_U[fieldname],
                );
                console.log("------------------------------------");
            }

            return { selected_U: NEW_selected_U };
        }),

    checked_CD: {}, // atomic states
    setChecked_CD: (fieldname, checked_CD_States) =>
        set((state) => {
            if (!fieldname) return { checked_CD: {} };

            const NEW_checked_CD = {
                ...state.checked_CD,
                [fieldname]: checked_CD_States,
            };

            if (state.debug || state.debug_checked_CD) {
                console.log(
                    `[M_STORE_DEBUG] NEW_checked_CD[${fieldname}]:`,
                    NEW_checked_CD[fieldname],
                );
                console.log(
                    `[M_STORE_DEBUG] state.checked_CU[${fieldname}] :`,
                    state.checked_CU[fieldname],
                );
                console.log("------------------------------------");
            }

            return { checked_CD: NEW_checked_CD };
        }),

    checked_CU: {}, // atomic states
    setChecked_CU: (fieldname, checked_CU_States) =>
        set((state) => {
            if (!fieldname) return { checked_CU: {} };

            const NEW_checked_CU = {
                ...state.checked_CU,
                [fieldname]: checked_CU_States,
            };

            if (state.debug || state.debug_checked_CU) {
                console.log(
                    `[M_STORE_DEBUG] state.checked_CD[${fieldname}]:`,
                    state.checked_CD[fieldname],
                );
                console.log(
                    `[M_STORE_DEBUG] New state.checked_CU[${fieldname}] :`,
                    NEW_checked_CU[fieldname],
                );
                console.log("------------------------------------");
            }

            return { checked_CU: NEW_checked_CU };
        }),

    has_M_value_Change: false,
    set_has_M_value_Change: (has_M_value_Change) =>
        set({ has_M_value_Change: has_M_value_Change }),

    hasJSON_Change: false,
    set_hasJSON_Change: (hasJSON_Change) =>
        set({ hasJSON_Change: hasJSON_Change }),

    activeTab: "m_data",
    setActiveTab: (tab) =>
        set((state) => {
            if (state.debug || state.debug_activeTab) {
                console.log(`[M_STORE_DEBUG] New setActiveTab :`, tab);
                console.log("------------------------------------");
            }
            return { activeTab: tab };
        }),

    activeSubTab: "d",
    setActiveSubTab: (subTab) =>
        set((state) => {
            if (state.debug || state.debug_activeSubTab) {
                console.log(`[M_STORE_DEBUG] New setActiveSubTab :`, subTab);
                console.log("------------------------------------");
            }
            return { activeSubTab: subTab };
        }),

    activeField: null,
    setActiveField: (field) =>
        set((state) => {
            if (state.debug || state.debug_activeField) {
                console.log(`[M_STORE_DEBUG] New activeField :`, field);
                console.log("------------------------------------");
            }
            return { activeField: field };
        }),

    /**
     * * M_value = all Data from each json file
     * * it depends on which Main Tab in Dashboard you clicked
     * * e.g. M_DATA, APP_DATA, ENTITIES
     */
    M_value: {},
    set_M_value: (new_M_value) =>
        set((state) => {
            if (state.debug || state.debug_M_value) {
                console.log(`[M_STORE_DEBUG] New M_value:`, new_M_value);
                console.log("------------------------------------");
            }
            return { M_value: new_M_value };
        }),
}));
