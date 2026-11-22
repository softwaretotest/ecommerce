import { createRecordService } from "@/features/record/record.service";
import { KEY } from "@/features/record/record.config";
import { storeSpList } from "@/stores/store.global";

const orderService = createRecordService("orders");

export async function createOrder(buyerUid, selectedProducts) {
    if (
        !buyerUid ||
        !Array.isArray(selectedProducts) ||
        selectedProducts.length === 0
    ) {
        return;
    }

    try {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const timeStampStr = `${yy}.${mm}.${dd}_${hh}.${min}.${ss}`;

        for (const product of selectedProducts) {
            const currentShopId = String(product?.shop_id || "UNKNOWN");
            const shortShop = currentShopId.slice(0, 4);
            const customOrderNumber = `${shortShop}_${timeStampStr}`;

            await orderService.addRecord({
                order_number: customOrderNumber,
                [KEY.USER_ID]: buyerUid,
                [KEY.PRODUCT_ID]: product.id,
                [KEY.QUANTITY]: Number(product?.quantity) || 0,
                [KEY.SHOP_ID]: product?.shop_id ?? null,
            });
        }

        storeSpList.getState().clearCart();
    } catch (error) {
        console.error("ERROR at create order:", error);
        throw error;
    }
}
