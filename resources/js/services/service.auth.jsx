import { useEffect, useState } from "react";
import {
    logout as googleLogout,
    loginWithGoogle,
    startAuthListener,
} from "@/flows/login/google/google.login";

import { L } from "@/i18n";

export function openChromeFromLine() {
    const isLineBrowser = /Line/i.test(navigator.userAgent);
    if (!isLineBrowser) return true;

    return new Promise((resolve) => {
        const ok = confirm(L.line_browser);

        if (ok) {
            const url =
                "googlechrome://navigate?url=" +
                encodeURIComponent(window.location.href);

            window.location.href = url;
        }

        resolve(false);
    });
}

/**
 * LOGIN
 */
export const login = async () => {
    return loginWithGoogle();
};

/**
 * LOGOUT
 */
export const logout = async () => {
    return googleLogout();
};

/**
 * MAIN AUTH HOOK
 */
export function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = startAuthListener({
            setUser: (u) => {
                setUser(u);
            },
        });

        return () => {
            unsubscribe?.();
        };
    }, []);

    return user;
}
