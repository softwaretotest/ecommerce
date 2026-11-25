import { useEffect, useState } from "react";

import { USER_FIELDS } from "@/features/user/user.config";
import { KEY } from "@/features/record/record.config";

import { storeUser, use_Ecom_Store } from "@/stores/store.global";
import useController from "./record.controller";
import RecordForm from "@/features/record/record.form";
import useRecordForm from "@/features/record/record.form.hook";
import Modal from "@/components/Modal";
import { useDev } from "@/components/DevProvider";
import { get_User } from "@/features/user/user.service";

/**
- Make POP up Edit Form for login User Profile
 */
export default function RecordProfile() {
    const { DEV } = useDev();
    const [editRecord, setEditRecord] = useState();
    const controller = useController(storeUser);
    const oauth = use_Ecom_Store((state) => state.oauth);

    useEffect(() => {
        const load = async () => {
            const userRecord = DEV
                ? controller.records.find(
                      (record) => record?.[KEY.UID] === oauth?.open_auth_uid,
                  )
                : await get_User(oauth?.open_auth_uid, "google");

            setEditRecord(userRecord);
        };

        if (oauth?.open_auth_uid) load();
    }, [oauth?.open_auth_uid]);

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
