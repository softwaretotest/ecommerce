// /Resources/Services/0_M_value_Service.js
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

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
            await fetch(API.M_VALUE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tab: activeTab,
                    subTab: activeSubTab,
                    data: new_M_value,
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
