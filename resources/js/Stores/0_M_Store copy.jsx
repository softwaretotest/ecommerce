// resources/js/Stores/0_M_Store.jsx

import { create } from "zustand";

/**
 * M_States Registry
 * * Stores field metadata dynamically mapped by fieldname.
 * * Matches PHP Constants structure (f::NAME, f::PRICE, etc.)
 * * * Example:
 * * M_States: {
 * * "f::NAME":  ['name', d::STRING, u::TEXT, cud::REQUIRED],
 * * "f::PRICE": ['price', [d::DECIMAL, 10, 2], u::NUMBER, [cd::DEFAULT, 0], s::CURRENCY]
 * * }
 */
export const use_M_Store = create((set) => ({
    activeTab: "m_data",
    setActiveTab: (tab) => set({ activeTab: tab }),

    M_States: {},

    /**
     * Update state for a given fieldname and its metadata values
     * * Example:
     * * fieldname: "f::PRICE"
     * * M_value: { s: s::CURRENCY }
     */
    setFocus: (fieldname, M_value) =>
        set((state) => {
            const nextStates = {
                ...state.M_States,
                [fieldname]: {
                    ...state.M_States?.[fieldname],
                    ...M_value,
                },
            };

            console.log(
                `M_Store - setFocus - fieldname: ${fieldname} - M_States updated:`,
                nextStates[fieldname],
            );

            return { M_States: nextStates };
        }),

    unset_States: () => set({ M_States: {} }),
}));
