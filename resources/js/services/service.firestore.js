import {
    collection,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

import { db } from "@/config/config.firebase";
// import { useDev } from "@/components/DevProvider";

/** we don't use firebase/storage now, because it costs.
 * til we have a customer who want to pay for our app, then we use storage
 * */
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const storage = getStorage();

/**
 * Image Upload (shared utility)
 */
// export const uploadImage = async (file) => {
//     const storageRef = ref(storage, "images/" + Date.now());
//     await uploadBytes(storageRef, file);
//     return await getDownloadURL(storageRef);
// };

/**
 * FIRESTORE FACTORY SERVICE
 * 1 instance = 1 collection (tableName)
 */
export const createFirestoreService = (tableName) => {
    /**
     * const { DEV } = useDev(); //tobe remove,
     * we will limit user add product
     * and DEV must confirm upload image and text before public
     */
    return {
        getRecords: async () => {
            const querySnapshot = await getDocs(collection(db, tableName));

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        },

        addRecord: async (data) => {
            // if (!DEV) {
            //     return crypto.randomUUID();
            // }
            const docRef = await addDoc(collection(db, tableName), data);
            return docRef.id;
        },

        deleteRecord: async (id) => {
            // if (!DEV) {
            //     return;
            // }
            await deleteDoc(doc(db, tableName, id));
        },

        updateRecord: async (id, data) => {
            // if (!DEV) {
            //     return;
            // }
            await updateDoc(doc(db, tableName, id), data);
        },
    };
};
