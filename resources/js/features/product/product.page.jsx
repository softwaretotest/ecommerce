import { storeProduct } from "@/stores/store.global";

import RecordPage from "@/features/record/record.page";
import { PRODUCT_FIELDS } from "@/features/product/product.config";
import { L } from "@/i18n";
import { PAGE } from "@/config/config.app";

function ProductPage({ setHeaderConfig }) {
    return (
        <RecordPage
            setHeaderConfig={setHeaderConfig}
            store={storeProduct}
            title={L.product}
            no_record={L.no_product}
            unit={L.assort}
            addLabel={L.add_product}
            RECORD_FIELDS={PRODUCT_FIELDS}
            PAGE_NAME={PAGE.PRODUCT}
        />
    );
}
export default ProductPage;
