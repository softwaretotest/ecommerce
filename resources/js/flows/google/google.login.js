import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    browserLocalPersistence,
    setPersistence,
    onAuthStateChanged,
} from "firebase/auth";

import { syncUser, syncAuthSession } from "@/features/user/user.service";

import { auth } from "@/config/config.firebase";
import { loadSpList } from "@/features/select/select.service";
import storeSpList from "@/features/select/select.store";

import { L } from "@/i18n";

const provider = new GoogleAuthProvider();

export const login = async () => {
    await setPersistence(auth, browserLocalPersistence);

    return signInWithPopup(auth, provider);
};

export const logout = () => signOut(auth);

/**
 * we don't use auth listener now, but can be usefull in future
 * onAuthStateChanged
 * @param {*} auth usecase e.g. auth.currentUser
 * auth changed e.g. when:
 * login
 * logout
 * token refresh
 * session restore
 * @return unsubscribe() if call it = stop listening , but not logout
 * e.g. if App need to break some how
 * , no use for now
 */
// export function startAuthListener({ set_user }) {
//     return onAuthStateChanged(auth, async (firebaseUser) => {
//         set_user(firebaseUser);

//         if (!firebaseUser) return;

//         await syncUser(firebaseUser, "google");

//         const selectProduct = await loadSpList(firebaseUser.uid);

//         storeSpList.getState().setSpList(selectProduct);
//     });
// }
export function startAuthListener({ set_user, set_oauth } = {}) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
            set_user?.(null);
            set_oauth?.(null);
            return;
        }

        const { user, oauth } = await syncAuthSession(firebaseUser, "google");
        set_user?.(user);
        set_oauth?.(oauth);

        const selectProduct = await loadSpList(user?.id);
        storeSpList.getState().setSpList(selectProduct);
    });
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
