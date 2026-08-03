// \resources\js\Hooks\useError.js
import { useState } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { rename_M_value_KEY_and_fieldname } from "@/Services/0_M_value_Service";

export function useError() {
    const { Error_FIELDNAME, set_Error_FIELDNAME } = use_M_Store();

    /**
     * * validate fieldname and show error if exists
     * * REGEX : explanation
     * * replace(/\s+/g, '_'); = replace whitepace
     * * alphanumeric_regex = /^[A-Z0-9_]*$/; = other symbole not allow except _
     * @param {*} event = value of fieldname input onChange
     * @returns
     */
    async function handle_Fieldname_Change(
        fieldname,
        set_fieldname = null,
        // options = {},
    ) {
        let FIELDNAME = fieldname.toUpperCase().replace(/\s+/g, "_");
        FIELDNAME = FIELDNAME.trim();

        // logic to validate alphanumeric
        const alphanumeric_regex = /^[A-Z0-9_]*$/;
        if (!alphanumeric_regex.test(FIELDNAME)) {
            set_error("Only alphanumeric and underscore are allowed.");
            return;
        }

        // if (typeof set_fieldname === "function" && options.ADD) {
        // set_fieldname(FIELDNAME);
        // }

        const M_value = use_M_Store.getState().M_value;
        const activeField = use_M_Store.getState().activeField;

        const isDuplicate = M_value && Object.keys(M_value).includes(FIELDNAME);

        if (isDuplicate) {
            set_error(
                `This field \u2003 ${fieldname.toUpperCase()} \u2003 already exists.`,
            );
            return;
        }

        if (!FIELDNAME) {
            set_error("Fieldname cannot be empty.");
            return;
        }

        // if (typeof set_fieldname === "function" && options.UPDATE) {
        //     set_fieldname(FIELDNAME);
        //     const OLD_KEY = activeField.toUpperCase();
        //     const NEW_KEY = FIELDNAME;
        //     await rename_M_value_KEY_and_fieldname(M_value, OLD_KEY, NEW_KEY);
        // }

        set_fieldname(FIELDNAME);
        set_Error_FIELDNAME("");
    }

    /**
     * * error blinks
     * * because of css .error-text (animation)
     * * and setTimeout to reset error text
     * * setTimeout is a trick to make
     * * React see the change and re-render the component
     * * otherwise, changing same React state immediately
     * * will not trigger re-render and React will ignore the change
     * @param {*} error_text
     */
    function set_error(error_text) {
        set_Error_FIELDNAME("");
        setTimeout(() => {
            set_Error_FIELDNAME(
                <span className="error-text">{error_text}</span>,
            );
        }, 50);
    }

    return {
        Error_FIELDNAME,
        handle_Fieldname_Change,
    };
}
