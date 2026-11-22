import storeSpList from "@/features/select/select.store";
import { productController, use_Ecom_Store } from "@/stores/store.global";
import { createOrder } from "@/features/order/order.service";
import { L } from "@/i18n";
import "./order.css";

export default function ButtonOrder() {
    const user = use_Ecom_Store((state) => state.user);

    // ดึงสเตตสินค้าในตะกร้าและฐานข้อมูลสินค้าหลักเพื่อนำมาแมปโครงสร้างภาพรวม
    const spItems = storeSpList((state) => state.select_product);
    const allProducts = productController.getRecords();
    const clearCart = storeSpList((state) => state.clearCart);

    const handleCheckout = async () => {
        if (!user?.uid) {
            alert(L.please_login);
            return;
        }

        const selectedProducts = spItems
            .map((spItem) => {
                const productDetail = allProducts.find(
                    (p) => p.id === spItem.product_id,
                );
                return {
                    ...productDetail,
                    quantity: spItem.quantity,
                };
            })
            .filter((p) => p.id);

        try {
            // save to db
            await createOrder(user.uid, selectedProducts);

            clearCart();

            alert(L.order_success);
        } catch (error) {
            alert(L.order_failure);
        }
    };

    return (
        <button
            className="btn-order btn-icon-only"
            onClick={handleCheckout}
            type="button"
        >
            📜
        </button>
    );
}
