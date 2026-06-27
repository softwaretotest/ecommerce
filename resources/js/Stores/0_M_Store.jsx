//0_M_Store.jsx

import { create } from "zustand";

export const use_M_Store = create((set) => ({
    D_States: {},
    CD_States: {},

    set_States: (fieldname, CD_States, D_States) =>
        set(() => ({
            D_States: {
                fieldname: fieldname,
                ...D_States,
            },
            CD_States: {
                fieldname: fieldname,
                ...CD_States,
            },
        })),

    unset_States: () =>
        set(() => ({
            D_States: {},
            CD_States: {},
        })),
}));
