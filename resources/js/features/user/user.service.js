import { createRecordService } from "@/features/record/record.service";
import { userController } from "@/stores/store.global";
import { logout } from "@/flows/google/google.login";

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

    await logout();
    window.location.href = "/";
};
