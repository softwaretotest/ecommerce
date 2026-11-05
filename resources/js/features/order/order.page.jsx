import { storeOrder } from "@/stores/store.global";

import RecordPage from "@/features/record/record.page";
import { ORDER_FIELDS } from "@/features/order/order.config";
import { L } from "@/i18n";
import { PAGE } from "@/config/config.app";

function OrderPage({ setHeaderConfig }) {
    return (
        <RecordPage
            setHeaderConfig={setHeaderConfig}
            store={storeOrder}
            title={L.order}
            no_record={L.no_order}
            unit={L.order}
            addLabel={L.add_order}
            RECORD_FIELDS={ORDER_FIELDS}
            PAGE_NAME={PAGE.ORDER}
        />
    );
}
export default OrderPage;
