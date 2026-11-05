import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/config/config.firebase";

import { KEY } from "@/features/record/record.config";

export const getUserProfile = async (uid) => {
    if (!uid) return null;

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...snap.data(),
    };
};

export const syncUser = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    // already exists
    if (userSnap.exists()) {
        return;
    }

    await setDoc(userRef, {
        uid: user.uid,

        [KEY.NAME]: user.displayName || "",

        [KEY.EMAIL]: user.email || "",

        [KEY.PHONE]: user.phoneNumber || "",

        [KEY.IMAGE]: user.photoURL || "",

        [KEY.IS_ACTIVE]: true,

        created_at: Date.now(),

        updatedAt: Date.now(),
    });
};

export const loadCurrentUserDocument = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
        uid,
        ...snap.data(),
    };
};
