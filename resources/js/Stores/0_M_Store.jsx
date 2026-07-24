// resources/js/Stores/0_M_Store.jsx

import { create } from "zustand";
import {
    get_D_NAME,
    get_D_NAME_by_FIELDNAME,
    get_U_NAME,
    get_U_NAME_by_FIELDNAME,
} from "@/Components/0_M_Data_Helper";

export const use_M_Store = create((set) => ({
    debug: false,
    debug_M_value: true,

    debug_selected_F_S: false,

    debug_selected_U: false,
    debug_selected_U_FOREIGN: false,
    debug_selected_D: false, // e.g. INTEGER , STRING
    debug_selected_D_FOREIGN: false,

    debug_checked_CU: false,
    debug_checked_CD: false, // e.g. ['INDEX', 'DEFAULT', 'NULLABLE']

    debug_activeField: false,
    debug_activeTab: false,
    debug_activeSubTab: false,

    debug_NEW_fieldname: false,

    debug_D_Params_State: false,

    debug_is_auto_uncheck_FOREIGN_by_CU_CD: false,

    is_auto_uncheck_FOREIGN_by_CU_CD: false,
    set_is_auto_uncheck_FOREIGN_by_CU_CD: (is_auto_uncheck_FOREIGN_by_CU_CD) =>
        set((state) => {
            if (state.debug || state.debug_is_auto_uncheck_FOREIGN_by_CU_CD) {
                console.log(
                    `[M_STORE_DEBUG] is_auto_uncheck_FOREIGN_by_CU_CD :`,
                    is_auto_uncheck_FOREIGN_by_CU_CD,
                );
                console.log("------------------------------------");
            }
            return {
                is_auto_uncheck_FOREIGN_by_CU_CD:
                    is_auto_uncheck_FOREIGN_by_CU_CD,
            };
        }),

    NEW_fieldname: null,
    set_NEW_fieldname: (NEW_fieldname) =>
        set((state) => {
            if (state.debug || state.debug_NEW_fieldname) {
                console.log(`[M_STORE_DEBUG] NEW_fieldname :`, NEW_fieldname);
                console.log("------------------------------------");
            }
            return { NEW_fieldname: NEW_fieldname };
        }),

    has_M_value_Change: false,
    set_has_M_value_Change: (has_M_value_Change) =>
        set({ has_M_value_Change: has_M_value_Change }),

    hasJSON_Change: false,
    set_hasJSON_Change: (hasJSON_Change) =>
        set({ hasJSON_Change: hasJSON_Change }),

    D_Params_State: {},
    set_D_Params_State: (fieldname, D_Params_State) =>
        set((state) => {
            if (!fieldname) return { D_Params_State: {} };

            const NEW_D_Params_State = {
                ...state.D_Params_State,
                [fieldname]: D_Params_State,
            };

            /**
             * * we need this log because,
             * * D_Params_State containt HTML <D_Params />
             * * to make console.log more readable
             * */
            if (state.debug || state.debug_D_Params_State) {
                console.log(`[DEBUG_DETAIL] Field: ${fieldname}`);
                console.log(
                    `[DEBUG_DETAIL] Type of content:`,
                    typeof NEW_D_Params_State[fieldname],
                );
                console.log(
                    `[DEBUG_DETAIL] Full Object:`,
                    NEW_D_Params_State[fieldname],
                );
                if (
                    NEW_D_Params_State[fieldname] &&
                    NEW_D_Params_State[fieldname].props
                ) {
                    console.log(
                        `[DEBUG_DETAIL] Props inside:`,
                        NEW_D_Params_State[fieldname].props,
                    );
                }
                console.log("------------------------------------");
            }

            return { D_Params_State: NEW_D_Params_State };
        }),

    selected_F_S: {}, // atomic states
    set_selected_F_S: (fieldname, selected_F_S_Value) =>
        set((state) => {
            if (!fieldname) return { selected_F_S: {} };

            const NEW_selected_F_S = {
                ...state.selected_F_S,
                [fieldname]: selected_F_S_Value,
            };

            if (state.debug || state.debug_selected_F_S) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_F_S[${fieldname}]:`,
                    NEW_selected_F_S[fieldname],
                );
                console.log("------------------------------------");
            }

            return { selected_F_S: NEW_selected_F_S };
        }),

    selected_U_FOREIGN: {}, // atomic states
    set_selected_U_FOREIGN: (FIELDNAME, selected_U_FOREIGN) =>
        set((state) => {
            if (!FIELDNAME) return { selected_U_FOREIGN: {} };

            const NEW_selected_U_FOREIGN = {
                ...state.selected_U_FOREIGN,
                [FIELDNAME]: selected_U_FOREIGN,
            };

            if (state.debug || state.debug_selected_U_FOREIGN) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_U_FOREIGN[${FIELDNAME}]:`,
                    NEW_selected_U_FOREIGN[FIELDNAME],
                );
                console.log("------------------------------------");
            }

            return { selected_U_FOREIGN: NEW_selected_U_FOREIGN };
        }),

    selected_D_FOREIGN: {}, // atomic states
    set_selected_D_FOREIGN: (FIELDNAME, selected_D_FOREIGN) =>
        set((state) => {
            if (!FIELDNAME) return { selected_D_FOREIGN: {} };

            const NEW_selected_D_FOREIGN = {
                ...state.selected_D_FOREIGN,
                [FIELDNAME]: selected_D_FOREIGN,
            };

            if (state.debug || state.debug_selected_D_FOREIGN) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_D_FOREIGN[${FIELDNAME}]:`,
                    NEW_selected_D_FOREIGN[FIELDNAME],
                );
                console.log("------------------------------------");
            }

            return { selected_D_FOREIGN: NEW_selected_D_FOREIGN };
        }),

    selected_D: {}, // atomic states
    set_selected_D: (FIELDNAME, selected_D_Value) =>
        set((state) => {
            if (!FIELDNAME) return { selected_D: {} };

            const NEW_selected_D = {
                ...state.selected_D,
                [FIELDNAME]: selected_D_Value,
            };

            if (state.debug || state.debug_selected_D) {
                console.log(
                    `[M_STORE_DEBUG] NEW_selected_D[${FIELDNAME}]:`,
                    NEW_selected_D[FIELDNAME],
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

    activeTab: "m_data", //default on refresh
    setActiveTab: (tab) =>
        set((state) => {
            if (state.debug || state.debug_activeTab) {
                console.log(`[M_STORE_DEBUG] New setActiveTab :`, tab);
                console.log("------------------------------------");
            }
            return { activeTab: tab };
        }),

    activeSubTab: "d", //default on refresh
    setActiveSubTab: (subTab) =>
        set((state) => {
            if (state.debug || state.debug_activeSubTab) {
                console.log(`[M_STORE_DEBUG] New setActiveSubTab :`, subTab);
                console.log("------------------------------------");
            }
            return { activeSubTab: subTab };
        }),

    activeField: null,
    setActiveField: (FIELDNAME) =>
        set((state) => {
            if (state.debug || state.debug_activeField) {
                console.log(`[M_STORE_DEBUG] New activeField :`, FIELDNAME);
                console.log("------------------------------------");
            }

            // selected_D can be save to prepare for the case, if FOREIGN clicked
            const D_NAME = get_D_NAME_by_FIELDNAME(FIELDNAME);
            state.set_selected_D(FIELDNAME, D_NAME);

            // selected_D can be save to prepare for the case, if FOREIGN clicked
            const U_NAME = get_U_NAME_by_FIELDNAME(FIELDNAME);
            state.set_selected_U(FIELDNAME, U_NAME);

            return { activeField: FIELDNAME };
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
