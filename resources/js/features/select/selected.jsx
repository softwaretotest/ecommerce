import storeSpList from "@/features/select/select.store";
import { productController } from "@/stores/store.global";
import ProductCard from "@/features/select/select.card";
import { L, getCurrencyLabel, formatCurrency } from "@/i18n";

import ButtonSpList from "@/features/select/btn-select-products";
import ButtonOrder from "@/features/order/btn-order";

import { createShopService } from "@/features/shop/shop.service";
import { getUserById } from "@/features/user/user.service";

export default function Selected({ onClose }) {
    const allProducts = productController.getRecords();

    // get all products from Zustand Store
    const spItems = storeSpList((state) => state.select_product);

    // filtered by product_id in store
    const selectedProducts = spItems
        .map((spItem) => {
            const productDetail = allProducts.find(
                (p) => p.id === spItem.product_id,
            );
            return {
                ...productDetail, // name, price, image
                qty: spItem.qty,
            };
        })
        .filter((p) => p.id); // handle filter in case no found (e.g. deleted), prevent crash undefined

    const shopService = createShopService();

    const grandTotalAmount = selectedProducts.reduce((totalSum, product) => {
        const qty = product?.qty ?? 0;
        const price = Number(product?.price) || 0;
        return totalSum + price * qty;
    }, 0);

    const TOTAL_AMOUNT = grandTotalAmount > 0 && (
        <span className="sp-total-amount-product">
            {formatCurrency(grandTotalAmount)} {getCurrencyLabel()}
        </span>
    );

    return (
        <div className="sp-shell">
            <div className="sp-header">
                {/* ButtonSpList only for show total selected products count , no action*/}
                <ButtonSpList />
                <div className="prod-count-total-price">
                    <span className="sp-count text-bg">
                        {selectedProducts.length} {L.product}
                    </span>
                    {TOTAL_AMOUNT}
                </div>
                <div className="flex-row">
                    {selectedProducts.length && <ButtonOrder />}
                    <button className="btn-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>
            </div>

            <div className="sp-page-area">
                {selectedProducts.length === 0 ? (
                    <div className="text-bg">{L.no_product}</div>
                ) : (
                    selectedProducts.map((product) => {
                        // 💡 1. เรียกดูข้อมูลร้านค้าจาก Store กลาง (Public Data) ตรงๆ ผ่าน shop_id ของสินค้าก่อนเลย
                        // วิธีนี้ทำให้ Guest (คนไม่ล็อกอิน) สามารถดึงชื่อร้านและรูปภาพจริงของร้านมาโชว์ได้ทันที โดยแอปไม่พัง
                        let shop = product?.shop_id
                            ? shopService.getShopById(product.shop_id)
                            : null;

                        // 💡 2. ตรวจสอบเงื่อนไขตามที่พี่วางกติกาไว้: หากวิธีแรกหาไม่เจอ หรือกรณีผู้ใช้ Login แล้ว
                        // ระบบจะขยับไปดึงข้อมูลเจ้าของร้านผ่าน getUserById มาประกอบร่างเป็น Fallback ให้แม่นยำขึ้น
                        if (!shop) {
                            const ownerUser = product?.user_id
                                ? getUserById(product?.user_id)
                                : null;
                            shop = ownerUser?.uid
                                ? shopService.getMyShop(ownerUser.uid)
                                : null;
                        }

                        return (
                            <ProductCard
                                key={product.id}
                                product={product} // ส่งชื่อ ราคา รูปสินค้า
                                shop={shop} // ส่งข้อมูลร้านค้า (ที่ดึงมาจากฐานข้อมูล Public สำเร็จแล้ว)
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
