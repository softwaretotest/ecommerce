import { create } from "zustand";

export const use_M_Store = create((set) => ({
    // เก็บแค่ "ตัวที่โฟกัสอยู่ตัวเดียว"
    M_Focus: {
        key: null,
        data: null,
    },

    // Action นี้จะล้างของเก่าทิ้งเสมอ และแทนที่ด้วยของใหม่
    set_M_Focus: (key, data) =>
        set(() => ({
            M_Focus: {
                key: key,
                data: data,
            },
        })),

    // Action สำหรับล้างค่าเวลาไม่ต้องการโฟกัสแล้ว
    clear_M_Focus: () =>
        set(() => ({
            M_Focus: {
                key: null,
                data: null,
            },
        })),
}));
