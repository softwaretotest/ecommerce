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
        const state = use_M_Store.getState();
        const { activeTab, activeSubTab } = state;

        try {
            // update Store suddenly
            state.set_M_value(new_M_value);

            // Save (using activeTab/SubTab data from UI)
            // ตรวจสอบโครงสร้างที่คุณส่งไป
            await fetch(API.M_VALUE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content, // สำคัญ!
                },
                body: JSON.stringify({
                    tab: activeTab, // ตรวจสอบว่ามีค่าจริง (ไม่ใช่ undefined)
                    subTab: activeSubTab, // ตรวจสอบว่ามีค่าจริง
                    data: new_M_value, // ตรวจสอบว่าเป็น Object/Array
                }),
            });

            console.log(
                `[SERVICE] Saved ${activeTab}/${activeSubTab} successfully!`,
            );
        } catch (error) {
            console.error("[SERVICE] Error saving:", error);
        }
    },
};
