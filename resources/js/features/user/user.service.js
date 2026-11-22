import { createRecordService } from "@/services/service.record";
import { KEY } from "@/features/record/record.config";
import { userController } from "@/stores/store.global";

const userService = createRecordService("users");

// export const getUserProfile = async (uid) => {
//     if (!uid) return null;

//     const users = await userService.getRecords();
//     if (!Array.isArray(users)) return null;

//     return (
//         users.find(
//             (u) =>
//                 String(u.uid) === String(uid) || String(u.id) === String(uid),
//         ) || null
//     );
// };

export const getUserProfile = async (uid) => {
    console.log("[getUserProfile] target uid:", uid, typeof uid);

    if (!uid) {
        console.log("[getUserProfile] missing uid -> return null");
        return null;
    }

    const users = await userService.getRecords();
    console.log(
        "[getUserProfile] users count:",
        Array.isArray(users) ? users.length : users,
    );

    if (!Array.isArray(users)) {
        return null;
    }

    const matchedUser = users.find((u, index) => {
        const recordUid = u?.uid ?? null;
        const recordId = u?.id ?? null;
        const isUidMatch =
            recordUid !== null && String(recordUid) === String(uid);
        const isIdMatch = recordId !== null && String(recordId) === String(uid);

        console.log(`[getUserProfile] [${index}]`, {
            recordId,
            recordUid,
            isUidMatch,
            isIdMatch,
        });

        return isUidMatch || isIdMatch;
    });

    console.log("[getUserProfile] matchedUser:", matchedUser ?? null);
    return matchedUser ?? null;
};

export const getAllUsers = () => {
    return userController.getRecords();
};

export const getUserById = (userId) => {
    const users = getAllUsers();
    if (!Array.isArray(users)) return undefined;

    return users.find((user) => String(user.id) === String(userId));
};

export const syncUser = async (user) => {
    try {
        if (!user) {
            return;
        }

        const payload = {
            uid: user.uid,
            [KEY.NAME]: user.displayName || "",
            [KEY.EMAIL]: user.email || "",
            [KEY.PHONE]: user.phoneNumber || "",
            [KEY.IMAGE]: user.photoURL || "",
            [KEY.IS_ACTIVE]: true,
        };

        const existing = await getUserProfile(user.uid);

        if (existing?.id) {
            await userService.updateRecord(existing.id, payload);
        } else {
            await userService.addRecord(payload);
        }

        console.log("USER SYNCED");
    } catch (error) {
        console.error("SYNC USER ERROR");
        console.error(error);
        console.error(error.code);
        console.error(error.message);
    }
};

export const loadCurrentUserDocument = async (uid) => {
    if (!uid) return null;

    const profile = await getUserProfile(uid);
    if (!profile) return null;

    return {
        uid: profile.uid || uid,
        ...profile,
    };
};

export const deleteUserProfile = async (uid) => {
    if (!uid) return;

    const confirmDelete = window.confirm(L.warn_deleting);
    if (!confirmDelete) return;

    const target = await getUserProfile(uid);
    if (target?.id) {
        await userService.deleteRecord(target.id);
    }

    await signOut(auth);
    window.location.href = "/";
};
