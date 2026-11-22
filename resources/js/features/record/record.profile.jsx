import { useEffect, useState } from "react";

import { USER_FIELDS } from "@/features/user/user.config";
import { KEY } from "@/features/record/record.config";

import { storeUser } from "@/stores/store.global";
import useController from "./record.controller";
import RecordForm from "@/features/record/record.form";
import useRecordForm from "@/features/record/record.form.hook";
import Modal from "@/components/Modal";
import { useDev } from "@/components/DevProvider";
import { getUserProfile } from "@/features/user/user.service";
import { use_Ecom_Store } from "@/stores/store.global";

/**
 * Make POP up Edit Form for login User Profile
 */
export default function RecordProfile() {
    const { DEV } = useDev();
    const [editRecord, setEditRecord] = useState();
    const controller = useController(storeUser);
    const user = use_Ecom_Store((state) => state.user);

    useEffect(() => {
        const load = async () => {
            const userRecord = DEV
                ? controller.records.find(
                      (record) => record?.[KEY.UID] === user?.uid,
                  )
                : await getUserProfile(user?.uid, "google");

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
