import RecordCard from "@/features/record/record.card";
import LoadingView from "@/components/LoadingView";
import { usePermit } from "@/config/config.permit";
import { L } from "@/i18n";
import { TYPE, KEY } from "@/features/record/record.config";
import { useAuth } from "@/services/service.auth";
import { useDev } from "@/components/DevProvider";
import { createShopService } from "@/features/shop/shop.service";

function RecordList(props) {
    const {
        setEditRecord,
        highlight,
        RECORD_FIELDS,
        controller,
        title,
        no_record,
        PAGE_NAME,
        active_ShopId,
        setActive_ShopId,
        active_Order,
        setActive_Order,
        allUsersCarts, // ➕ ส่งตะกร้าของทุกคนลงไป
        setShowSelectProduct,
    } = props;
    const { DEV } = useDev();
    if (controller?.isRecordLoading) {
        return <LoadingView loadingName={title} />;
    }

    if (controller?.recordError) {
        return (
            <div className="card-container">
                <h1 className="text-bg">{L.no_db_connection}</h1>
            </div>
        );
    }

    if (!controller?.records.length) {
        return (
            <div className="card-container">
                <h1 className="text-bg">{no_record}</h1>
            </div>
        );
    }

    const { isPage_Shop, isPage_Product, isPage_Select, isPage_Order } =
        usePermit(PAGE_NAME, controller);
    const user = useAuth();

    function renderRecordCard(record) {
        return (
            <RecordCard
                key={record.id} //React use key to find record, that user interacts with
                record={record}
                setEditRecord={setEditRecord}
                highlight={highlight}
                onDelete={controller.remove}
                loadingId={controller.loadingId}
                RECORD_FIELDS={RECORD_FIELDS}
                isPage_Shop={isPage_Shop}
                isPage_Product={isPage_Product}
                isPage_Select={isPage_Select}
                isPage_Order={isPage_Order}
                active_ShopId={active_ShopId}
                setActive_ShopId={setActive_ShopId}
                active_Order={active_Order}
                setActive_Order={setActive_Order}
                allUsersCarts={allUsersCarts} // ➕ ส่งตะกร้าของทุกคนลงไป
                setShowSelectProduct={setShowSelectProduct}
            />
        );
    }

    if ((isPage_Shop || isPage_Product) && !DEV) {
        return controller.records
            .filter((record) => record?.[KEY.USER_ID] === user?.uid)
            .map((record) => renderRecordCard(record));
    }

    if (isPage_Order) {
        const groupedByOrderNumber = controller.records.reduce(
            (resultGroup, currentRecord) => {
                const orderNo = currentRecord?.order_number;
                if (!orderNo) return resultGroup;

                const existingGroup = resultGroup.find(
                    (o) => o.order_number === orderNo,
                );

                if (existingGroup) {
                    existingGroup.qty =
                        (existingGroup.qty || 0) + (currentRecord?.qty || 0);
                } else {
                    resultGroup.push({
                        id: currentRecord.id,
                        order_number: orderNo,
                        user_id: currentRecord?.user_id,
                        shop_id: currentRecord?.shop_id,
                        product_id: currentRecord?.product_id,
                        qty: currentRecord?.qty || 0,
                    });
                }
                return resultGroup;
            },
            [],
        );

        /**
         * hide order of other shop owner
         */
        if (!DEV) {
            const shopService = createShopService();
            const shop = shopService.getShopByUserId(user?.uid);
            return groupedByOrderNumber
                .filter((order) => order?.shop_id === shop?.id)
                .map((order) => renderRecordCard(order));
        }

        return groupedByOrderNumber.map((order) => renderRecordCard(order));
    }

    //default = isPage_Select all customer with no login
    return controller.records.map((record) => renderRecordCard(record));
}

export default RecordList;
