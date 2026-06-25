// 0_M_CD_Rule.jsx

/**
 * Main Orchestrator Function
 * Executes all constraint rules sequentially to ensure data integrity.
 */
export function CD_Rule_Check(currentSelections, newSelection, isChecked) {
    let nextSelections = isChecked
        ? [...currentSelections, newSelection]
        : currentSelections.filter((i) => i !== newSelection);

    // Run all rule functions to clean up the state
    nextSelections = REQUIRED_vs_NULLABLE(
        nextSelections,
        newSelection,
        isChecked,
    );
    nextSelections = UNIQUE_vs_NULLABLE(
        nextSelections,
        newSelection,
        isChecked,
    );
    nextSelections = UNIQUE_vs_REQUIRED(
        nextSelections,
        newSelection,
        isChecked,
    );
    nextSelections = UNIQUE_vs_DEFAULT(nextSelections, newSelection, isChecked);
    nextSelections = PRIMARY_KEY_vs_OTHERS(
        nextSelections,
        newSelection,
        isChecked,
    );

    return nextSelections;
}

/**
 * REQUIRED vs NULLABLE
 * Selection rule: Choose only one.
 * If REQUIRED is selected, NULLABLE must be unchecked.
 * If NULLABLE is selected, REQUIRED must be unchecked.
 */
function REQUIRED_vs_NULLABLE(selections, newSelection, isChecked) {
    if (isChecked && newSelection === "REQUIRED")
        return selections.filter((i) => i !== "NULLABLE");
    if (isChecked && newSelection === "NULLABLE")
        return selections.filter((i) => i !== "REQUIRED");
    return selections;
}

/**
 * UNIQUE vs NULLABLE
 * Selection rule: These two cannot be selected together.
 * If UNIQUE is selected, NULLABLE must be unchecked.
 * If NULLABLE is selected, UNIQUE must be unchecked.
 */
function UNIQUE_vs_NULLABLE(selections, newSelection, isChecked) {
    if (isChecked && newSelection === "UNIQUE")
        return selections.filter((i) => i !== "NULLABLE");
    if (isChecked && newSelection === "NULLABLE")
        return selections.filter((i) => i !== "UNIQUE");
    return selections;
}

/**
 * UNIQUE vs REQUIRED
 * Selection rule: These can be selected together.
 * Best practice for fields like Tokens or Keys.
 */
function UNIQUE_vs_REQUIRED(selections, newSelection, isChecked) {
    return selections;
}

/**
 * UNIQUE vs DEFAULT
 * Selection rule: Use with caution.
 * Ensure the default value provided is unique across all rows.
 */
function UNIQUE_vs_DEFAULT(selections, newSelection, isChecked) {
    return selections;
}

/**
 * PRIMARY KEY vs OTHERS
 * Selection rule: Choose only one.
 * Primary Key automatically handles Index, Unique, and Not Null.
 */
function PRIMARY_KEY_vs_OTHERS(selections, newSelection, isChecked) {
    if (isChecked && newSelection === "PRIMARY") {
        return ["PRIMARY"];
    }
    return selections;
}
