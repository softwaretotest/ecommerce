import { useEffect, useState } from "react";

import { USER_FIELDS } from "@/features/user/user.config";
import { TYPE, KEY } from "@/features/record/record.config";
import { useAuth } from "@/services/service.auth";

import { storeUser } from "@/stores/store.global";
import useController from "./record.controller";
import RecordForm from "@/features/record/record.form";
import useRecordForm from "@/features/record/record.form.hook";
import Modal from "@/components/Modal";
import { useDev } from "@/components/DevProvider";
// import { createUserService } from "@/services/service.user";// old
import { getUserProfile } from "@/features/user/user.service";

/**
 * Make POP up Edit Form for login User Profile
 */
export default function RecordProfile() {
    const { DEV } = useDev();
    const [editRecord, setEditRecord] = useState();
    const userService = createUserService();
    const controller = useController(storeUser);
    const user = useAuth();

    useEffect(() => {
        const load = async () => {
            const userRecord = DEV
                ? controller.records.find(
                      (record) => record?.[KEY.UID] === user?.uid,
                  )
                : await getUserProfile(user?.uid);
            // : await userService.getMyProfile(user?.uid); //old

            setEditRecord(userRecord);
        };

        if (user?.uid) load();
    }, [user?.uid]);

    const formHook = useRecordForm(
        editRecord,
        setEditRecord,
        null,
        USER_FIELDS,
        storeUser,
        null,
    );

    const { showForm, handleClose } = formHook;

    return (
        <>
            {showForm && (
                <Modal onClose={handleClose}>
                    <RecordForm {...formHook} />
                </Modal>
            )}
        </>
    );
}
