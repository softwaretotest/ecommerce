import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/config/config.firebase";

import { KEY } from "@/features/record/record.config";

import { userController } from "@/stores/store.global";

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

/**
 * all shops from global store
 */
export const getAllUsers = () => {
    return userController.getRecords();
};

/**
 * find shop by shop id
 */
export const getUserById = (userId) => {
    const users = getAllUsers();

    return users.find((user) => user.id === userId);
};

export const syncUser = async (user) => {
    try {
        if (!user) {
            return;
        }

        const userRef = doc(db, "users", user.uid);

        const payload = {
            uid: user.uid,

            [KEY.NAME]: user.displayName || "",

            [KEY.EMAIL]: user.email || "",

            [KEY.PHONE]: user.phoneNumber || "",

            [KEY.IMAGE]: user.photoURL || "",

            [KEY.IS_ACTIVE]: true,

            created_at: Date.now(),

            updatedAt: Date.now(),
        };

        await setDoc(userRef, payload);

        console.log("🔥 USER CREATED");
    } catch (error) {
        console.error("🚨 SYNC USER ERROR");
        console.error(error);
        console.error(error.code);
        console.error(error.message);
    }
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
