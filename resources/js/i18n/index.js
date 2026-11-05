import { LANG, BaseLang } from "./lang";

// --- normalize ---
const normalizeLang = (locale) => {
    if (!locale) return BaseLang;
    return locale.toLowerCase().split("-")[0];
};

// --- detect lang en de th ---
export const getUserLang = () => {
    const dbLang = window.__USER_LANG__;
    const browserLang = navigator.language;

    const detected = normalizeLang(dbLang || browserLang);

    // support specific language
    const supported = ["th", "de", "en"];

    if (supported.includes(detected)) {
        return detected;
    }

    // 👉 fallback
    return "en";
};

const appLang = getUserLang();

// --- validate ---
function validateLang(base, target, langName) {
    if (typeof base !== "object" || typeof target !== "object") return;

    Object.keys(base).forEach((key) => {
        // ignore metadata (ถ้ามี)
        if (key === "key") return;

        if (!(key in target)) {
            console.warn(`[i18n] Missing key "${key}" in ${langName}`);
        }
    });

    // (optional) check key เกิน
    Object.keys(target).forEach((key) => {
        if (key === "key") return;

        if (!(key in base)) {
            console.warn(`[i18n] Extra key "${key}" in ${langName}`);
        }
    });
}

// Make currency readable for no Thai people
export function getCurrencyLabel() {
    if (false === ["th"].includes(appLang)) {
        return BaseLang === "th" ? "THB" : "CHF";
    }
    return LANG[BaseLang].currency;
}

// validate lang.js
/**
 * import.meta.env.DEV = vite running in DEV mode
 *
 * e.g.
 * npm run dev
 * → true
 * npm run build
 * → false
 */
if (import.meta.env.DEV) {
    const base = LANG[BaseLang];
    Object.entries(LANG).forEach(([langName, lang]) => {
        validateLang(base, lang, langName);
    });
}

// --- translator ---
export const L = new Proxy(LANG[appLang], {
    get(target, prop) {
        if (!(prop in target)) {
            console.warn(`[i18n] Missing key: ${String(prop)}`);
            return prop;
        }
        return target[prop];
    },
});

// --- currency ---
const CURRENCY_MAP = {
    th: { locale: "th-TH", currency: "THB" },
    de: { locale: "de-CH", currency: "CHF" },
    en: { locale: "en-US", currency: "CHF" }, // business rule
};

/**
 * show lang format of browser setting first or en lang
 */
export const cfg = CURRENCY_MAP[appLang] || CURRENCY_MAP.en;
const isSwiss = cfg.locale === "de-CH";

export const formatCurrency = (value) => {
    let result = new Intl.NumberFormat(cfg.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

    // Swiss override
    if (isSwiss) {
        result = result.replace(".", ",");
    }

    return result;
};

export const formatNumberLabel = (value) =>
    new Intl.NumberFormat(cfg.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20,
    }).format(value);
