import { L } from "@/i18n";

import { KEY, TYPE } from "@/features/record/record.config";

export function validateRequired(value) {
    if (value === "" || value === null || value === undefined) {
        return L.must_insert_data;
    }

    if (typeof value === "string" && value.trim() === "") {
        return L.must_insert_data;
    }

    return "";
}

export function validateAmount(amount) {
    const value = Number(amount);

    // if (!amount) {  // cannot check like this , becaus amount=0 is valid
    if (amount === "" || amount === null || amount === undefined) {
        return L.must_insert_data;
    }

    if (isNaN(value)) {
        return L.must_number;
    }

    if (value < 0) {
        return L.must_positive;
    }

    return "";
}

export function validateEmail(value) {
    if (!value || value.trim() === "") {
        return L.must_insert_data;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isValidEmail.test(value)) {
        return L.must_correct_email;
    }

    return "";
}

export function validatePhone(value) {
    if (!value || value.trim() === "") {
        return L.must_insert_data;
    }

    /**
     * valid patterns:
     * +66812345678
     * 0812345678
     * 0012345678
     */
    const isValid = /^\+?[0-9]+$/.test(value);

    if (!isValid) {
        return L.must_phone_nr;
    }

    return "";
}

export function validateRecord(record, fields) {
    return fields.reduce((errors, field) => {
        const value = record[field.key];

        let error = "";

        const isEmpty = value === "" || value === null || value === undefined;

        /**
         * 1. REQUIRED (ONLY from config)
         */
        if (field.required && isEmpty) {
            errors[field.key] = validateRequired(value);
            return errors;
        }

        /**
         * 2. TYPE validation (only if not empty)
         */
        if (!isEmpty) {
            if (field.type === TYPE.NUMBER || field.type === TYPE.CURRENCY) {
                error = validateAmount(value);
            }

            if (field.type === TYPE.EMAIL) {
                error = validateEmail(value);
            }

            // if (field.type === TYPE.PHONE) {
            //     error = validatePhone(value);
            // }
        }

        errors[field.key] = error;

        return errors;
    }, {});
}
