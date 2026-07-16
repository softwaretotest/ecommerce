// \resources\js\Components\0_M_Rules.jsx
import { use_M_Store } from "@/Stores/0_M_Store";

export async function validate_UI(checkbox_group_name, event) {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();

    const checked_CD =
        (use_M_Store.getState().checked_CD &&
            use_M_Store.getState().checked_CD[fieldname]) ||
        [];

    const checked_CU =
        (use_M_Store.getState().checked_CU &&
            use_M_Store.getState().checked_CU[fieldname]) ||
        [];

    const setChecked_CD = use_M_Store.getState().setChecked_CD;

    const setChecked_CU = use_M_Store.getState().setChecked_CU;

    if (checkbox_group_name === "CD") {
        await update_CD_FOREIGN(event);
        if (event.target.value === "REQUIRED") update_CU_REQUIRED();
    }
    if (checkbox_group_name === "CU") {
        await update_CD_FOREIGN(event);
        if (event.target.value === "REQUIRED") update_CD_REQUIRED();
    }

    /**
     * * logic for cud::REQUIRED
     * * check and uncheck REQUIRED of CD and CU same time
     */
    async function update_CD_REQUIRED() {
        const currentCU = store.checked_CU[fieldname] || [];
        const is_REQUIRED = currentCU.includes("REQUIRED");
        const currentCD = store.checked_CD[fieldname] || [];
        let newCD;
        if (is_REQUIRED) {
            newCD = currentCD.includes("REQUIRED")
                ? currentCD
                : [...currentCD, "REQUIRED"];
        } else {
            newCD = currentCD.filter((item) => item !== "REQUIRED");
        }
        await setChecked_CD(fieldname, newCD);
    }

    /**
     * * logic for cud::REQUIRED
     * * check and uncheck REQUIRED of CD and CU same time
     */
    async function update_CU_REQUIRED() {
        const currentCD = store.checked_CD[fieldname] || [];
        const is_REQUIRED = currentCD.includes("REQUIRED");
        const currentCU = store.checked_CU[fieldname] || [];
        let newCU;
        if (is_REQUIRED) {
            newCU = currentCU.includes("REQUIRED")
                ? currentCU
                : [...currentCU, "REQUIRED"];
        } else {
            newCU = currentCU.filter((item) => item !== "REQUIRED");
        }
        await setChecked_CU(fieldname, newCU);
    }

    /**
     * * logic for FOREIGN
     * * ...............................
     * * CASE : checked_CD has FOREIGN
     * * remove all field_items and set only cd::FOREIGN
     * * expected field_data = [fieldname, cd::FOREIGN]
     * * ...............................
     * * CASE : checked_CD has States e.g. DEFAULT , INDEX , NULLABLE , ...
     * * remove FOREIGN from check_CD if exist
     * * ...............................
     */
    async function update_CD_FOREIGN(event) {
        const fieldname = activeField.toLowerCase();
        const currentCD = store.checked_CD[fieldname] || [];
        const currentCU = store.checked_CU[fieldname] || [];
        let newCD = currentCD;
        let newCU = currentCU;

        if (event.target.checked && event.target.value === "FOREIGN") {
            newCD = ["FOREIGN"];
            newCU = [];
            // Logic to remove defaulValue from D_Dropdown and U_Dropdown
        }

        if (event.target.checked && event.target.value !== "FOREIGN") {
            newCD = currentCD.filter((item) => item !== "FOREIGN");
        }

        await store.setChecked_CD(fieldname, newCD);
        await store.setChecked_CU(fieldname, newCU);

        console.log(
            "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- currentCD = ",
            currentCD,
        );
        console.log(
            "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- event.target.checked =  ",
            event.target.checked,
        );
        console.log(
            "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- event.target.value =  ",
            event.target.value,
        );
        console.log("-----------------------------------------------");
    }
}
