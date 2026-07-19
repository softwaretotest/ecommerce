// \resources\js\Components\0_M_Rules.jsx
import { M_value_Service } from "@/Services/0_M_value_Service";
import { use_M_Store } from "@/Stores/0_M_Store";
import {
    remove_D_from_Backend,
    update_D_SAVE_Backend,
} from "@/Components/0_M_Data_Helper";
export async function validate_UI(checkbox_group_name, event) {
    const store = use_M_Store.getState();
    const activeField = use_M_Store.getState().activeField;
    const fieldname = activeField.toLowerCase();
    const FIELDNAME = activeField.toUpperCase();

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

    // Rules for CD , CU Actions
    if (checkbox_group_name === "CD") {
        await update_CD_FOREIGN(event);
        if (event.target.value === "REQUIRED") update_CU_REQUIRED();
    }
    if (checkbox_group_name === "CU") {
        await update_CD_FOREIGN(event);
        if (event.target.value === "REQUIRED") update_CD_REQUIRED();
    }

    // Rules for FOREIGN Actions
    await remove_D_from_selected_D_if_FOREIGN();
    await restore_previous_selected_D_if_FOREIGN(event);

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

        // console.log(
        //     "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- currentCD = ",
        //     currentCD,
        // );
        // console.log(
        //     "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- event.target.checked =  ",
        //     event.target.checked,
        // );
        // console.log(
        //     "JKLÖFDASJKLÖFDSA - validate_UI -- update_CD_FOREIGN --- event.target.value =  ",
        //     event.target.value,
        // );
        // console.log("-----------------------------------------------");
    }

    /**
     * if FOREIGN checked , then clear selected_D
     */
    async function remove_D_from_selected_D_if_FOREIGN() {
        const { checked_CD, selected_D, set_selected_D } =
            use_M_Store.getState();

        const is_FOREIGN_checked = checked_CD[fieldname]?.includes("FOREIGN");

        if (is_FOREIGN_checked) {
            set_selected_D(fieldname, "");
            remove_D_from_Backend();
        }
    }

    async function restore_previous_selected_D_if_FOREIGN(event) {
        const { checked_CD, selected_D, set_selected_D, selected_D_FOREIGN } =
            use_M_Store.getState();

        const is_FOREIGN_was_unchecked =
            // event.target.value === "FOREIGN" &&
            !checked_CD[fieldname]?.includes("FOREIGN");

        console.log(
            " !!!!!!!!!!! Rules -- is_FOREIGN_was_unchecked = ",
            is_FOREIGN_was_unchecked,
            ` -- selected_D_FOREIGN[${FIELDNAME}] = `,
            selected_D_FOREIGN[FIELDNAME],
        );

        if (is_FOREIGN_was_unchecked) {
            await set_selected_D(fieldname, selected_D_FOREIGN[FIELDNAME]);

            const D_NAME = use_M_Store.getState().selected_D_FOREIGN[FIELDNAME];
            console.log(
                " !!!!!!!!!!! Rules -- is_FOREIGN_was_unchecked = ",
                is_FOREIGN_was_unchecked,

                ` -- selected_D_FOREIGN[${FIELDNAME}] = `,
                selected_D_FOREIGN[FIELDNAME],

                ` -- D_NAME = ${D_NAME}`,
            );

            update_D_SAVE_Backend(D_NAME);
        }
    }
}
