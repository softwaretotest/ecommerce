// /Resources/Services/0_M_value_Service.js
import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { API } from "@/Configs/api";

/**
 * UPDATE M_value (M_Store) and JSON_Content
 * @param {*} new_M_value
 * * activeTab  subTab
 * * M-DATA     CD D U CU CUD S
 * * APP-DATA   F T
 * * ENTITIES   ENTITIES
 */
export const M_value_Service = {
    update: async (new_M_value) => {
        const activeTab = use_M_Store.getState().activeTab;
        const activeSubTab = use_M_Store.getState().activeSubTab;

        try {
            const csrfToken = getCookie("XSRF-TOKEN");

            // ตรวจสอบโครงสร้างที่คุณส่งไป
            const response = await fetch(API.M_VALUE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"), // important!
                },
                body: JSON.stringify({
                    tab: activeTab, // ตรวจสอบว่ามีค่าจริง (ไม่ใช่ undefined)
                    subTab: activeSubTab, // ตรวจสอบว่ามีค่าจริง
                    data: new_M_value, // ตรวจสอบว่าเป็น Object/Array
                }),
            });

            // ตรวจสอบสถานะก่อนอ่าน JSON
            if (!response.ok) throw new Error("Server error");

            const result = await response.json();
            return result;

            console.log(
                `[SERVICE] Saved ${activeTab}/${activeSubTab} successfully!`,
            );
        } catch (error) {
            console.error("[SERVICE] Error saving:", error);
        }
    },
};

/**
 * this to solve problem , content = null
 * * headers: {
 * *   "Content-Type": "application/json",
 * *    "X-CSRF-TOKEN": document.querySelector(
 * *        'meta[name="csrf-token"]',
 * *    ).content, // important!
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};
