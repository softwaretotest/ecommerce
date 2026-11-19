import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/config.firebase";

const COLLECTION = "select_products";

export async function loadSpList(user_id) {
    if (!user_id) return [];
    const ref = doc(db, COLLECTION, user_id);

    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return [];
    }

    return snap.data().select_product || [];
}

export async function saveSpList(user_id, select_product) {
    if (!user_id) return [];
    const ref = doc(db, COLLECTION, user_id);

    await setDoc(
        ref,
        {
            select_product,
        },
        {
            merge: true,
        },
    );
}
