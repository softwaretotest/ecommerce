import { storeShop } from "@/stores/store.global";

import RecordPage from "@/features/record/record.page";
import { SHOP_FIELDS } from "@/features/shop/shop.config";
import { L } from "@/i18n";
import { PAGE } from "@/config/config.app";

function ShopPage({ setHeaderConfig }) {
    return (
        <RecordPage
            setHeaderConfig={setHeaderConfig}
            store={storeShop}
            title={L.shop}
            no_record={L.no_shop}
            unit={L.shop}
            addLabel={L.add_shop}
            RECORD_FIELDS={SHOP_FIELDS}
            PAGE_NAME={PAGE.SHOP}
        />
    );
}
export default ShopPage;
