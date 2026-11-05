import storeOrder from "@/stores/store.global"; // หรือดึงมาจาก store กลางของคุณ
import OrderCard from "./order.card";
import { L } from "@/i18n";
import "./order.css"; // เรียกใช้ดีไซน์โมดูลสไตล์เดียวกับสกรอลบาร์ทอง sp-

export default function OrderList({ orders = [] }) {
    return (
        <div className="sp-shell">
            <div className="sp-header">
                <div className="prod-count-total-price">
                    <span className="sp-header-shop-name text-bg">
                        {L.order || "รายการสั่งซื้อ"}
                    </span>
                </div>
                <span className="sp-count text-bg">{orders.length} รายการ</span>
            </div>

            <div className="sp-page-area">
                {orders.length === 0 ? (
                    <div className="text-bg">{L.no_order}</div>
                ) : (
                    orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </div>
    );
}
