import { use_Ecom_Store } from "@/stores/store.global";
import { L } from "@/i18n";

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";

function applyAuthState(data, { set_user, set_oauth } = {}) {
    const nextUser = data?.user ?? null;
    const nextOauth = data?.oauth ?? null;

    const storeState = use_Ecom_Store.getState();
    storeState.set_user?.(nextUser);
    storeState.set_oauth?.(nextOauth);

    set_user?.(nextUser);
    set_oauth?.(nextOauth);
}

async function sync_Laravel_Session(idToken) {
    const response = await fetch("/api/auth/google", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
        throw new Error(`Laravel session sync failed: ${response.status}`);
    }

    return response.json();
}

async function clear_Laravel_Session() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Laravel logout failed: ${response.status}`);
    }
}

function loadGoogleIdentityScript() {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve(window.google.accounts.id);
            return;
        }

        const existing = document.querySelector(
            `script[src="${GIS_SCRIPT_URL}"]`,
        );
        if (existing) {
            existing.addEventListener("load", () => {
                if (window.google?.accounts?.id) {
                    resolve(window.google.accounts.id);
                } else {
                    reject(new Error("Google Identity Services unavailable"));
                }
            });
            existing.addEventListener("error", () =>
                reject(new Error("Failed to load Google Identity Services")),
            );
            return;
        }

        const script = document.createElement("script");
        script.src = GIS_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google?.accounts?.id) {
                resolve(window.google.accounts.id);
            } else {
                reject(new Error("Google Identity Services unavailable"));
            }
        };
        script.onerror = () =>
            reject(new Error("Failed to load Google Identity Services"));
        document.head.appendChild(script);
    });
}

export const requestGoogleIdToken = async (clientId) => {
    if (!clientId) {
        throw new Error("Missing Google Client ID");
    }

    const googleId = await loadGoogleIdentityScript();

    return new Promise((resolve, reject) => {
        let settled = false;

        googleId.initialize({
            client_id: clientId,
            callback: (response) => {
                if (settled) return;
                settled = true;
                if (response?.credential) {
                    resolve(response.credential);
                } else {
                    reject(new Error("No credential returned from Google"));
                }
            },
        });

        googleId.prompt((notification) => {
            if (settled) return;
            if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
            ) {
                settled = true;
                reject(
                    new Error(
                        `Google prompt not displayed: ${notification.getNotDisplayedReason?.() || notification.getSkippedReason?.() || "unknown"}`,
                    ),
                );
            }
        });
    });
};

export const login = async (idToken, callbacks = {}) => {
    if (!idToken) {
        throw new Error("Missing Google ID token");
    }

    const data = await sync_Laravel_Session(idToken);
    applyAuthState(data, callbacks);
    return data;
};

export const logout = async (callbacks = {}) => {
    await clear_Laravel_Session();
    applyAuthState({ user: null, oauth: null }, callbacks);
};

export function startAuthListener({ set_user, set_oauth } = {}) {
    let active = true;
    const requestUrl = new URL("/api/auth/me", window.location.href);

    console.info("auth request", {
        pageOrigin: window.location.origin,
        requestUrl: requestUrl.href,
    });

    (async () => {
        try {
            const response = await fetch(requestUrl.href, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });

            console.info("auth response", {
                status: response.status,
                ok: response.ok,
                responseUrl: response.url,
            });

            if (!active) return;

            if (!response.ok) {
                applyAuthState(
                    { user: null, oauth: null },
                    { set_user, set_oauth },
                );
                return;
            }

            const data = await response.json();
            if (!active) return;

            applyAuthState(data, { set_user, set_oauth });
        } catch (err) {
            console.error("Auth listener error:", err);

            if (!active) return;

            applyAuthState(
                { user: null, oauth: null },
                { set_user, set_oauth },
            );
        }
    })();

    return () => {
        active = false;
    };
}

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
