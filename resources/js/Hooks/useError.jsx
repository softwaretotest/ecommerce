// \resources\js\Hooks\useError.js
import { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";

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
    function handle_Fieldname_Change(fieldname, set_fieldname = null) {
        let FIELDNAME = fieldname.toUpperCase().replace(/\s+/g, "_");
        FIELDNAME = FIELDNAME.trim();

        // logic to validate alphanumeric
        const alphanumeric_regex = /^[A-Z0-9_]*$/;
        if (!alphanumeric_regex.test(FIELDNAME)) {
            set_error("Only alphanumeric and underscore are allowed.");
            return;
        }

        if (typeof set_fieldname === "function") {
            set_fieldname(FIELDNAME);
        }

        const M_value = use_M_Store.getState().M_value;

        const isDuplicate = M_value && Object.keys(M_value).includes(FIELDNAME);

        if (isDuplicate) {
            set_error("This field name already exists.");
            return;
        } else {
            set_Error_FIELDNAME(""); // clear if no error
        }

        if (!FIELDNAME) {
            set_error("Fieldname cannot be empty.");
            return;
        }
    }

    function set_error(error_text) {
        set_Error_FIELDNAME("");
        setTimeout(() => {
            set_Error_FIELDNAME(
                <span className="error-text">{error_text}</span>,
            );
        }, 5);
    }

    return {
        Error_FIELDNAME,
        handle_Fieldname_Change,
    };
}
