// resources/js/Stores/0_M_Store.jsx
import { create } from "zustand";
import { set_Focus_D_CD_States } from "@/Components/0_M_Focus_D_CD_States";

export const use_M_Store = create((set) => ({
    // ... OLD solution ...
    D_States: {},
    CD_States: {},
    set_States: (fieldname, CD_States, D_States) =>
        set(() => ({
            D_States: { fieldname: fieldname, ...D_States },
            CD_States: { fieldname: fieldname, ...CD_States },
        })),
    // unset_States: () => set(() => ({ D_States: {}, CD_States: {} })),

    // ---- NEW Solution --------------------------------------------------
    // M_States: null,

    // setFocus: (fieldname, M_value) =>
    //     set(() => {
    //         const [D_States, CD_States] = set_Focus_D_CD_States(
    //             fieldname,
    //             M_value,
    //         );

    //         console.log("🚀 [Store Update] Focus Changed to:", fieldname);
    //         console.log("📊 New D_States:", D_States);
    //         console.log("📊 New CD_States:", CD_States);

    //         return {
    //             D_States: { fieldname, ...D_States },
    //             CD_States: { fieldname, ...CD_States },
    //         };
    //     }),
}));
