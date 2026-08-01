// \resources\js\Hooks\useError.js
import { useState } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { rename_M_value_KEY_and_fieldname } from "@/Services/0_M_value_Service";
import { M_value_Service } from "@/Services/0_M_value_Service";

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
        options = {},
    ) {
        let FIELDNAME = fieldname.toUpperCase().replace(/\s+/g, "_");
        FIELDNAME = FIELDNAME.trim();

        // logic to validate alphanumeric
        const alphanumeric_regex = /^[A-Z0-9_]*$/;
        if (!alphanumeric_regex.test(FIELDNAME)) {
            set_error("Only alphanumeric and underscore are allowed.");
            return;
        }

        if (typeof set_fieldname === "function" && options.ADD) {
            set_fieldname(FIELDNAME);
        }

        const M_value = use_M_Store.getState().M_value;
        const activeField = use_M_Store.getState().activeField;

        const check_KEY_for_isDuplicate =
            activeField && activeField.startsWith("t::") // case ENTITIES, KEY = t::TABLENAME
                ? "t::" + FIELDNAME
                : FIELDNAME;

        const isDuplicate =
            M_value && Object.keys(M_value).includes(check_KEY_for_isDuplicate);

        if (isDuplicate) {
            set_error(
                `This field \u2003 ${fieldname.toUpperCase()} \u2003 already exists.`,
            );
            return;
        } else {
            set_Error_FIELDNAME(""); // clear if no error
        }

        if (!FIELDNAME) {
            set_error("Fieldname cannot be empty.");
            return;
        }

        if (typeof set_fieldname === "function" && options.UPDATE) {
            set_fieldname(FIELDNAME);
            let OLD_KEY = "";
            let NEW_KEY = "";
            if (activeField.startsWith("t::")) {
                // case TABLENAME of ENTITIES
                // before e.g. t::orders , after e.g. t::ORDERS
                OLD_KEY = activeField.toUpperCase().replace("T", "t");
                NEW_KEY = "t::" + FIELDNAME;
            } else {
                // in case M_value_KEY of APP_DATA
                OLD_KEY = activeField.toUpperCase();
                NEW_KEY = FIELDNAME;
            }

            rename_M_value_KEY_and_fieldname(M_value, OLD_KEY, NEW_KEY);
        }
    }

    function set_error(error_text) {
        set_Error_FIELDNAME(<span className="error-text">{error_text}</span>);
    }

    return {
        Error_FIELDNAME,
        handle_Fieldname_Change,
    };
}
