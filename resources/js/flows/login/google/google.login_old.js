import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    browserLocalPersistence,
    setPersistence,
    onAuthStateChanged,
} from "firebase/auth";

import { syncUser } from "./google.user";
import { auth } from "@/config/config.firebase";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
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
import { loadSpList } from "@/features/select/select.service";
import storeSpList from "@/features/select/select.store";

export function startAuthListener({ setUser }) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);

        if (!firebaseUser) return;

        await syncUser(firebaseUser);

        const selectProduct = await loadSpList(firebaseUser.uid);

        storeSpList.getState().setSpList(selectProduct);
    });
}
