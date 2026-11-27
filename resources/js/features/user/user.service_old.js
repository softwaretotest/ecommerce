import { signOut } from "firebase/auth";
import { auth } from "@/config/config.firebase";
import { createRecordService } from "@/features/record/record.service";
import { KEY } from "@/features/record/record.config";
import { userController } from "@/stores/store.global";

const userService = createRecordService("users");
const oauthService = createRecordService("oauth");

export const get_OAuth = async (openAuthUid, accountType) => {
    if (!openAuthUid) return null;

    const oauthList = await oauthService.getRecords();
    if (!Array.isArray(oauthList)) return null;

    return (
        oauthList.find(
            (row) =>
                String(row?.open_auth_uid) === String(openAuthUid) &&
                String(row?.account_type) === String(accountType),
        ) || null
    );
};

export const getUserById = (userId) => {
    const users = userController.getRecords();
    if (!Array.isArray(users)) return undefined;

    return users.find((user) => String(user?.id) === String(userId));
};

export const get_User = async (openAuthUid, accountType) => {
    if (!openAuthUid) return null;

    const oauthRow = await get_OAuth(openAuthUid, accountType);
    if (!oauthRow?.user_id) return null;

    const users = await userService.getRecords();
    if (!Array.isArray(users)) return null;

    const matchedUser =
        users.find((u) => String(u?.id) === String(oauthRow.user_id)) || null;

    if (!matchedUser) return null;

    return {
        ...matchedUser,
        open_auth_uid: oauthRow.open_auth_uid,
        account_type: oauthRow.account_type,
    };
};

export const delete_User = async (openAuthUid, accountType) => {
    if (!openAuthUid) return;

    const oauthRow = await get_OAuth(openAuthUid, accountType);
    if (oauthRow?.id) {
        await oauthService.deleteRecord(oauthRow.id);
    }
    if (oauthRow?.user_id) {
        await userService.deleteRecord(oauthRow.user_id);
    }

    await signOut(auth);
    window.location.href = "/";
};

export const syncUser = async (firebaseUser, accountType) => {
    try {
        if (!firebaseUser?.uid) return null;

        const openAuthUid = firebaseUser.uid;
        const userPayload = {
            [KEY.NAME]: firebaseUser.displayName || "",
            [KEY.EMAIL]: firebaseUser.email || "",
            [KEY.IMAGE]: firebaseUser.photoURL || "",
            [KEY.IS_ACTIVE]: true,
        };

        const existingOauth = await get_OAuth(openAuthUid, accountType);
        const users = await userService.getRecords();
        let userRecord =
            existingOauth?.user_id && Array.isArray(users)
                ? users.find(
                      (u) => String(u?.id) === String(existingOauth.user_id),
                  ) || null
                : null;

        let targetUserId = userRecord?.id ?? existingOauth?.user_id ?? null;

        if (targetUserId) {
            await userService.updateRecord(targetUserId, userPayload);
            userRecord = {
                ...(userRecord || {}),
                id: targetUserId,
                ...userPayload,
            };
        } else {
            const createdId = await userService.addRecord(userPayload);
            targetUserId = createdId;
            userRecord = { id: createdId, ...userPayload };
        }

        const oauthPayload = {
            user_id: targetUserId,
            account_type: accountType,
            open_auth_uid: openAuthUid,
        };

        let oauthRecord = null;
        if (existingOauth?.id) {
            await oauthService.updateRecord(existingOauth.id, oauthPayload);
            oauthRecord = {
                ...existingOauth,
                ...oauthPayload,
            };
        } else {
            const createdOauthId = await oauthService.addRecord(oauthPayload);
            oauthRecord = {
                id: createdOauthId,
                ...oauthPayload,
            };
        }

        return {
            user: userRecord,
            oauth: oauthRecord,
        };
    } catch (error) {
        console.error("SYNC USER ERROR", error);
        alert("SYNC USER ERROR");
        return null;
    }
};

export const syncAuthSession = async (firebaseUser, accountType) => {
    if (!firebaseUser?.uid) {
        return { user: null, oauth: null };
    }

    const synced = await syncUser(firebaseUser, accountType);
    if (!synced) {
        return { user: null, oauth: null };
    }

    let userRecord = synced.user ?? null;
    let oauthRecord = synced.oauth ?? null;

    if (!userRecord) {
        const user = await get_User(firebaseUser.uid, accountType);
        if (user) {
            userRecord = Object.fromEntries(
                Object.entries(user).filter(
                    ([key]) => !["open_auth_uid", "account_type"].includes(key),
                ),
            );
            if (!oauthRecord) {
                oauthRecord = {
                    user_id: userRecord.id ?? null,
                    account_type: user.account_type ?? accountType,
                    open_auth_uid: user.open_auth_uid ?? firebaseUser.uid,
                };
            }
        }
    }

    if (!oauthRecord) {
        oauthRecord = (await get_OAuth(firebaseUser.uid, accountType)) || {
            user_id: userRecord?.id ?? null,
            account_type: accountType,
            open_auth_uid: firebaseUser.uid,
        };
    }

    return {
        user: userRecord,
        oauth: oauthRecord,
    };
};
