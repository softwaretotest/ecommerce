import { storeUser } from "@/stores/store.global";

import RecordPage from "@/features/record/record.page";
import { USER_FIELDS } from "@/features/user/user.config";
import { L } from "@/i18n";
import { PAGE } from "@/config/config.app";

function UserPage({ setHeaderConfig }) {
    return (
        <RecordPage
            setHeaderConfig={setHeaderConfig}
            store={storeUser}
            title={L.user}
            no_record={L.no_user}
            icon={"👤"}
            unit={L.person}
            addLabel={L.add_user}
            RECORD_FIELDS={USER_FIELDS}
            PAGE_NAME={PAGE.USER}
        />
    );
}
export default UserPage;
