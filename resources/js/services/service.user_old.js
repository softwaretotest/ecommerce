import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/config.firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/config/config.firebase";
import { L } from "@/i18n";

export const createUserService = () => {
    return {
        getMyProfile: async (uid) => {
            const snap = await getDoc(doc(db, "users", uid));

            if (!snap.exists()) return null;

            return {
                id: snap.id,
                ...snap.data(),
            };
        },
    };
};

export const deleteUserProfile = async (uid) => {
    if (!uid) return;

    const confirmDelete = window.confirm(L.warn_deleting);

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "users", uid));
    await signOut(auth);

    window.location.href = "/";
};
