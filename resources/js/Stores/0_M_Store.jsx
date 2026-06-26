// 0_M_Store.jsx

import { create } from "zustand";

export const use_M_Store = create((set) => ({
    // เก็บสถานะกฎของทุกฟิลด์ โดยใช้ fieldKey เป็นตัวระบุ
    // โครงสร้าง: { "field_key_1": { PRIMARY: false, NULLABLE: false, ... }, ... }
    rules: {},

    // Action สำหรับอัปเดตค่า
    // คุณเรียกใช้: updateRule(fieldKey, "PRIMARY", true)
    updateRule: (fieldKey, ruleName, value) => {
        set((state) => {
            // ดึงกฎของฟิลด์นั้นๆ ออกมา (ถ้าไม่มีให้เป็น Object ว่าง)
            const currentRules = state.rules[fieldKey] || {
                PRIMARY: false,
                NULLABLE: false,
                UNIQUE: false,
                FOREIGN: false,
                INDEX: false,
                REQUIRED: false,
                DEFAULT: false,
                READONLY: false,
                DISABLED: false,
            };

            const nextRules = { ...currentRules, [ruleName]: value };

            // --- ใส่ Convention ตรงนี้ ---
            // ถ้าติ๊ก PRIMARY ให้เอา FOREIGN ออก
            if (ruleName === "PRIMARY" && value === true) {
                nextRules["FOREIGN"] = false;
            }

            // ถ้าติ๊ก FOREIGN ให้เอา PRIMARY ออก
            if (ruleName === "FOREIGN" && value === true) {
                nextRules["PRIMARY"] = false;
            }

            return {
                rules: {
                    ...state.rules,
                    [fieldKey]: nextRules,
                },
            };
        });
    },

    // ฟังก์ชันสำหรับโหลดค่าเริ่มต้น (ถ้ามี)
    initRules: (fieldKey, initialData = []) => {
        set((state) => {
            if (state.rules[fieldKey]) return state; // ถ้ามีแล้วไม่โหลดซ้ำ

            const newRules = {
                PRIMARY: initialData.includes("PRIMARY"),
                NULLABLE: initialData.includes("NULLABLE"),
                UNIQUE: initialData.includes("UNIQUE"),
                FOREIGN: initialData.includes("FOREIGN"),
                INDEX: initialData.includes("INDEX"),
                REQUIRED: initialData.includes("REQUIRED"),
                DEFAULT: initialData.includes("DEFAULT"),
                READONLY: initialData.includes("READONLY"),
                DISABLED: initialData.includes("DISABLED"),
            };
            return { rules: { ...state.rules, [fieldKey]: newRules } };
        });
    },
}));
