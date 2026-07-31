// \resources\utils\setCursor.js

/**
 * * called when e.g. user types to update fieldname
 * * to set cursor on the previous focus to continue editing fieldname
 * * becaus onChange of input M_value_KEY , new fieldname was added.
 * * TabContent re-renders itself and the cursor looses focus
 * * JS logic to set cursor on input where value = activeField
 * @param {*} activeField
 */
export function setCursor(activeField) {
    const targetInput = document.querySelector(
        `.fieldname[value="${activeField}"], .M_value_KEY[value="${activeField?.toUpperCase()}"]`,
    );
    targetInput.focus();
    targetInput.setSelectionRange(
        targetInput.value.length,
        targetInput.value.length,
    );
}
