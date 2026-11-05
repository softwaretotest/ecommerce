import { useEffect, useState } from "react";

import {
    injectCss,
    removeCss,
    initCssInjectorObserver,
} from "@/utils/CssInjector/CssInjector";

import { storeProduct, storeShop, storeUser } from "@/stores/store.global";

export default function useAppBootstrap() {
    /**
     * global app theme
     */
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "luxury",
    );

    /**
     * init global systems once
     */
    useEffect(() => {
        initCssInjectorObserver();

        storeUser.getState().fetch();
        storeShop.getState().fetch();
        storeProduct.getState().fetch();
    }, []);

    /**
     * sync app theme
     */
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem("theme", theme);

        /**
         * inject utility css
         * only for themes that use image backgrounds
         */
        if (theme === "luxury") {
            injectCss("bg-image");
        } else {
            removeCss("bg-image");
        }
    }, [theme]);

    return {
        theme,
        setTheme,
    };
}
