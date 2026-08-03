// \resources\js\Hooks\useError_v2.js
import { useState, useRef } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { rename_M_value_KEY_and_fieldname } from "@/Services/0_M_value_Service";

/**
 * * TODO optional - add function M_value_Service.update_cascade,
 * * that can update M_vale_MAIN-TABLE and _CASCADE-TABLE all at once
 * * to avoid error Race Condition (fast typing or hold on a Key onKeyboard)
 * * Because, this useError_v2 does update (user types 1 char, backend update JSON),
 * * onChange input.M_value_KEY ot tablename
 * * this useError_v2.js works only 99%
 * * sometime save M_value_MAIN , but _CASCADE lost saving
 * * (e.g. update app_data.f , cascade entities.t)
 * @returns
 */
export function useError_v2() {
    const { Error_FIELDNAME, set_Error_FIELDNAME } = use_M_Store();

    const typingTimeout_Ref = useRef(null);
    const isProcessing_Ref = useRef(false);

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
        console.log("--> Triggered input change:", fieldname);

        // --- ด่านที่ 1: ล็อกเด็ดขาดถ้ากำลัง Async/Save อยู่ ---
        if (isProcessing_Ref.current) {
            console.log(
                "❌ Blocked: System is currently processing previous request.",
            );
            set_error("System is processing, please wait...");
            return;
        }

        // --- ด่านที่ 2: Debounce ดักจับการพิมพ์รัว / กดค้าง ---
        if (typingTimeout_Ref.current) {
            clearTimeout(typingTimeout_Ref.current);

            // เรียกใช้ฟังก์ชันแสดง Error แบบโชว์แช่นิ่งๆ ให้อ่านทัน
            show_persistent_error(
                "Please do not hold down keys or type too fast!",
            );
        }

        /**
         * * delay ms to stop for update Backend,
         * * before get next input value
         */
        return new Promise((resolve) => {
            typingTimeout_Ref.current = setTimeout(async () => {
                typingTimeout_Ref.current = null;

                await executeValidationAndSave(
                    fieldname,
                    set_fieldname,
                    options,
                );
                resolve();
            }, 100);
        });
    }

    // ฟังก์ชันสำหรับแสดง Error แบบโชว์แช่นิ่งๆ ไม่อมค่าทิ้ง
    function show_persistent_error(error_text) {
        set_Error_FIELDNAME(<span className="error-text">{error_text}</span>);
    }

    // แยกฟังก์ชันการทำงานจริงออกมา เพื่อให้ Debounce ควบคุมได้สมบูรณ์
    async function executeValidationAndSave(fieldname, set_fieldname, options) {
        let FIELDNAME = fieldname.toUpperCase().replace(/\s+/g, "_");
        FIELDNAME = FIELDNAME.trim();

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

        const isDuplicate = M_value && Object.keys(M_value).includes(FIELDNAME);

        if (isDuplicate) {
            set_error(
                `This field \u2003 ${fieldname.toUpperCase()} \u2003 already exists.`,
            );
            return;
        } else {
            set_Error_FIELDNAME("");
        }

        if (!FIELDNAME) {
            set_error("Fieldname cannot be empty.");
            return;
        }

        if (typeof set_fieldname === "function" && options.UPDATE) {
            set_fieldname(FIELDNAME);
            const OLD_KEY = activeField.toUpperCase();
            const NEW_KEY = FIELDNAME;

            try {
                isProcessing_Ref.current = true;
                console.log(
                    "🔄 Starting Cascade & Save for:",
                    OLD_KEY,
                    "->",
                    NEW_KEY,
                );

                await rename_M_value_KEY_and_fieldname(
                    M_value,
                    OLD_KEY,
                    NEW_KEY,
                );

                console.log("✅ Cascade & Save Completed Successfully.");
            } catch (err) {
                console.error("🔥 Error during rename/cascade:", err);
            } finally {
                isProcessing_Ref.current = false;
            }
        }
    }

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
