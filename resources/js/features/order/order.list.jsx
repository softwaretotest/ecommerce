import {
    productController,
    storeUser,
    storeOrder,
} from "@/stores/store.global";
import { L, getCurrencyLabel, formatCurrency } from "@/i18n";
import { KEY } from "@/features/record/record.config";
import OrderCard from "./order.card";
import "./order.css";

export default function OrderList({ user_id, order_number, onClose }) {
    const products = productController.getRecords();
    const users = storeUser((state) => state.records) || [];
    const customer = users.find((u) => u.id === user_id);
    const allOrderRecords = storeOrder((state) => state.records) || [];

    // Filter records by exact unique order_number
    const orderRecords = allOrderRecords.filter(
        (order) => order?.order_number === order_number,
    );

    // Calculate total amount for this order group
    const orderTotalAmount = orderRecords.reduce((totalSum, orderItem) => {
        const productDetail = products.find(
            (p) => p.id === orderItem?.product_id,
        );
        const qty = Number(orderItem?.quantity) || 0;
        const price = Number(productDetail?.[KEY.PRICE]) || 0;
        return totalSum + price * qty;
    }, 0);

    const TOTAL_AMOUNT = orderTotalAmount > 0 && (
        <span className="sp-total-amount-product">
            {formatCurrency(orderTotalAmount)} {getCurrencyLabel()}
        </span>
    );

    return (
        <div className="sp-shell">
            <div className="sp-header">
                <div className="prod-count-total-price">
                    <span className="sp-header-shop-name text-bg">
                        {customer?.name}
                    </span>
                    {TOTAL_AMOUNT}
                </div>
                <span className="sp-count text-bg">
                    {orderRecords.length} รายการ
                </span>
                <button className="btn-modal-close" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="sp-page-area">
                {orderRecords.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
