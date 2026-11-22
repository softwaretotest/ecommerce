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
 * ```text
 * MAIN AUTH HOOK
 * x
 * This useEffect hook subscribes to authentication state changes
 * when the component mounts and cleans up the subscription when it unmounts:
 * 1. On mount ([] dependencies): Calls startAuthListener
 * and passes a setUser callback so auth state updates (u) update local user state.
 * It stores the returned cleanup function in unsubscribe.
 * x
 * 2. On unmount: Returns a cleanup function
 * that safely invokes unsubscribe?.() to detach the listener
 * and prevent stale updates or memory leaks.
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
