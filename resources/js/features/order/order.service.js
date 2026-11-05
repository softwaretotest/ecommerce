import { db } from "@/config/config.firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { KEY } from "@/features/record/record.config";
import { storeSpList } from "@/stores/store.global";

const COLLECTION = "orders";

export async function createOrder(buyerUid, selectedProducts) {
    if (!buyerUid || selectedProducts.length === 0) return;

    try {
        // make timestamp
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const timeStampStr = `${yy}.${mm}.${dd}_${hh}.${min}.${ss}`;

        // วนลูปสินค้าในตะกร้าเพื่อยิงแยก Record ส่งคลาวด์ลง Firestore
        for (const product of selectedProducts) {
            const currentShopId = product?.shop_id || "UNKNOWN";

            // use only 4 first chars of shop_id to make order-nr
            const shortShop = currentShopId.slice(0, 4);
            const customOrderNumber = `${shortShop}_${timeStampStr}`;
            // order_number = shop_id + timestamp e.g. t1le_26.06.06_06.55.00

            await addDoc(collection(db, COLLECTION), {
                order_number: customOrderNumber,
                [KEY.USER_ID]: buyerUid,
                [KEY.PRODUCT_ID]: product.id,
                qty: Number(product?.qty) || 0,
                shop_id: currentShopId,
                created_at: serverTimestamp(),
            });

            // 🎯 Next Step Action: Clear all products from the local basket store immediately after successful checkout
            storeSpList.getState().clearCart();
        }
    } catch (error) {
        console.error("ERROR at create order:", error);
        throw error;
    }
}
