// resources/js/Components/0_M_MAP.js

export const DEFAULT_VALUES_MAP = {
    STRING: "",
    INTEGER: 0,
    DECIMAL: 0,
    BOOLEAN: false,
};

export const D_PARAMS_MAP = {
    DECIMAL: [
        { label: "Total digits", default: 10 },
        { label: "Scale", default: 2 },
    ],
    STRING: [{ label: "Length", default: 255 }],
    DEFAULT: [{ label: "Value" }],
};
