// resources/js/Stores/0_M_Store.jsx

// resources/js/Stores/0_M_Store.jsx

import { create } from "zustand";

/**
 * M_States Registry
 * * Stores all class data dynamically per fieldname
 * * M_States: {
 * * "f::NAME":  ['name', d::STRING , u::TEXT , cud::REQUIRED],
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
            const cleanData = M_value[fieldname]
                ? { [fieldname]: M_value[fieldname] }
                : M_value;

            const nextStates = {
                ...state.M_States,
                [fieldname]: {
                    ...state.M_States?.[fieldname],
                    ...cleanData,
                },
            };

            console.log(
                `M_Store [SUCCESS] - Data applied to ${fieldname}:`,
                nextStates[fieldname],
            );

            return { M_States: nextStates };
        }),

    unset_States: () => set({ M_States: {} }),
}));
