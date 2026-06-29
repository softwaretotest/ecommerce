// resources/js/Stores/0_M_Store.jsx
import { create } from "zustand";

export const use_M_Store = create((set) => ({
    // ... OLD solution ...
    D_States: {},
    CD_States: {},
    set_States: (fieldname, CD_States, D_States) =>
        set(() => ({
            D_States: { fieldname: fieldname, ...D_States },
            CD_States: { fieldname: fieldname, ...CD_States },
        })),
    unset_States: () => set(() => ({ D_States: {}, CD_States: {} })),

    // ---- NEW Solution --------------------------------------------------
    M_States: null,
    set_M_States: (data) => set({ M_States: data }),

    /**
     * update is a test function, will be deleted
     */
    update: (path, value) =>
        set((state) => {
            const keys = path.split(".");
            const newState = { ...state.M_States };

            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            console.log("Store Updated:", path, "to", value);
            console.log("New M_States:", newState);

            return { M_States: newState };
        }),

    updateField: (fieldName, newValue) =>
        set((state) => {
            // ตรงนี้คือที่ที่ Logic การอัปเดตจะอยู่
            // เราสามารถเรียกฟังก์ชันเก่า (ที่ทำไว้เมื่อวาน) มาใช้คำนวณค่าในนี้ได้เลย
            // เพื่อให้มั่นใจว่าผลลัพธ์เหมือนเดิม
            return { ...state /* อัปเดตข้อมูล */ };
        }),
}));
