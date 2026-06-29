// resources/js/Stores/0_M_Store.jsx
import { create } from "zustand";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

export const use_M_Store = create((set) => ({
    // --- Tab State ---
    activeTab: "m_data",
    setActiveTab: (tab) => set({ activeTab: tab }),

    // --- Existing States ---
    D_States: {},
    CD_States: {},
    unset_States: () => set(() => ({ D_States: {}, CD_States: {} })),

    // --- Focus Logic ---
    M_States: null,
    setFocus: (fieldname, M_value) =>
        set(() => {
            const [D_States, CD_States] = set_Focus_D_CD_States(
                fieldname,
                M_value,
            );
            return {
                D_States: { fieldname, ...D_States },
                CD_States: { fieldname, ...CD_States },
            };
        }),
}));
