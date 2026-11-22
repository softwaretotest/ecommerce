import js from "@eslint/js";

export default [
    {
        files: ["resources/js/**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            "no-duplicate-imports": "error",
        },
    },
];
