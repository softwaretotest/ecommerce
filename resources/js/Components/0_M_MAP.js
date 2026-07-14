// resources/js/Components/0_M_MAP.js

export const DEFAULT_VALUES_MAP = {
    BOOLEAN: false,
    DECIMAL: 0,
    INTEGER: 0,
    STRING: "",
    UNSIGNED_BINT: 0,
};

export const D_PARAMS_MAP = {
    DECIMAL: [
        { label: "Total digits", default: 10 },
        { label: "Scale", default: 2 },
    ],
    STRING: [{ label: "Length", default: 255 }],
    DEFAULT: [{ label: "Value" }],
};
