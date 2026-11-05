/**
 * CssInjector is a dynamic runtime utility injection
 * need Observer for the targets html appearing
 * compare to tailwind does not need observer
 * because, tailwind class already exist in jsx
 *
 * ========================================a
 * IMPORT CSS
 * ========================================
 */

import "./CssInjector.css";

/**
 * ========================================
 * CSS INJECT TARGETS
 * ========================================
 */

// this components in App have same styles
const CSS_INJECT_TARGETS = {
    "btn-3d": [
        "sidebar-btn-menu",
        "sidebar-btn-item",
        "btn-setting-item",
        "crud-btn-save",
        "crud-btn-add",
        "crud-btn-edit",
        "crud-btn-delete",
        "crud-btn-cancel",
        "btn-setting",
        "ifm-icon-only",
        "btn-icon-only",
        "btn-open-shop-product",
        "btn-plus",
        "btn-minus",
        "btn-select-products",
        "btn-order",
        "btn-open-order-list",
    ],
    "bg-full": [
        // buttons
        "sidebar-btn-menu",
        "sidebar-btn-item",
        "btn-setting-item",
        "crud-btn-save",
        "crud-btn-add",
        "crud-btn-edit",
        "crud-btn-delete",
        "crud-btn-cancel",
        "btn-setting",
        "ifm-icon-only",
        "btn-icon-only",
        "btn-open-shop-product",
        "btn-plus",
        "btn-minus",
        "btn-select-products",
        "btn-order",
        "btn-open-order-list",

        // other surface
        "header",
        "sp-header",
        "sp-card-container",
        "sp-header-content",
        "card-container",
        "form-edit",
        "form-add",
    ],
    "surface-3d": [
        // buttons
        "sidebar-btn-menu",
        "sidebar-btn-item",
        "btn-setting-item",
        "crud-btn-save",
        "crud-btn-add",
        "crud-btn-edit",
        "crud-btn-delete",
        "crud-btn-cancel",
        "btn-setting",
        "btn-icon-only",
        "btn-open-shop-product",
        "btn-plus",
        "btn-minus",
        "btn-select-products",
        "sp-card-container",
        "btn-order",
        "btn-open-order-list",

        // other surface
        "header",
        "sp-header",
        "sp-header-content",
        "sp-header",
        "form-edit",
        "form-add",
    ],

    "surface-3d-card": [
        "card-container",
        "ifm-icon-only",
        "sp-header-content",
        "sp-header",
    ],
};

/**
 * ========================================
 * CORE INJECT / REMOVE
 * ========================================
 */

export function injectCss(className) {
    const targets = CSS_INJECT_TARGETS[className];
    if (!targets) return;

    targets.forEach((targetClass) => {
        const elements = document.querySelectorAll(`.${targetClass}`);

        elements.forEach((element) => {
            element.classList.add(className);
        });
    });
}

export function removeCss(className) {
    const targets = CSS_INJECT_TARGETS[className];
    if (!targets) return;

    targets.forEach((targetClass) => {
        const elements = document.querySelectorAll(`.${targetClass}`);

        elements.forEach((element) => {
            element.classList.remove(className);
        });
    });
}

/**
 * ========================================
 * APPLY ALL REGISTERED INJECTIONS
 * ========================================
 */

/**
 * [Description for applyAll]
 *
 * @return [type]
 *
 */
function applyAll() {
    Object.keys(CSS_INJECT_TARGETS).forEach((className) => {
        injectCss(className);
    });
}

/**
 * ========================================
 * MUTATION OBSERVER (SINGLE INSTANCE)
 * will inject when the targets appear
 * 
 * call useEffect from component that should observe
 * e.g. from App.jsx
 * 
 * useEffect(() => {
         initCssInjectorObserver();
     }, []);
 * 
 * ========================================
 */

let observerStarted = false;

export function initCssInjectorObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const observer = new MutationObserver(() => {
        // Re-apply all injections whenever DOM changes
        applyAll();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // initial run
    applyAll();
}
