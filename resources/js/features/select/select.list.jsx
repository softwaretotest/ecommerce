import { useEffect } from "react";

import { useAuth } from "@/services/service.auth";

import { productController, shopController } from "@/stores/store.global";

import { L, getCurrencyLabel, formatCurrency } from "@/i18n";

import { KEY } from "@/features/record/record.config";
import { loadSpList } from "@/features/select/select.service";
import ProductCard from "@/features/select/select.card";
import storeSpList from "@/features/select/select.store";
import ButtonSpList from "@/features/select/btn-select-products";
import "./select.list.css";

export default function SpList({ shop_id, onClose, setShowSelectProduct }) {
    const products = productController.getRecords();

    const shop = shopController.getById(shop_id);

    const SpLists = products.filter(
        (product) => product?.[KEY.SHOP_ID] === shop_id,
    );

    const user = useAuth();

    const setSpList = storeSpList((s) => s.setSpList);

    /**
     * load products from db and put them into the basket
     * if user logged in (also DEV can see getAllUsersCarts if logged in)
     */
    useEffect(() => {
        async function initCart() {
            if (!user?.uid) return;
            const list = await loadSpList(user?.uid);
            setSpList(list);
        }

        initCart();
    }, [user?.uid]);

    const selectProduct = storeSpList((s) => s.select_product); // ดึงสเตตสินค้าในตะกร้าปัจจุบัน

    const shopTotalAmount = SpLists.reduce((totalSum, product) => {
        const cartItem = selectProduct.find(
            (item) => item.product_id === product.id,
        );
        const qty = cartItem?.qty ?? 0;
        const price = Number(product?.[KEY.PRICE]) || 0;
        return totalSum + price * qty;
    }, 0);

    /**
     * Total price of selected products in a list
     */
    const TOTAL_AMOUNT = shopTotalAmount > 0 && (
        <span className="sp-total-amount-product">
            {formatCurrency(shopTotalAmount)} {getCurrencyLabel()}
        </span>
    );

    const handleSelected = () => {
        if (setShowSelectProduct) {
            onClose(); // 1. close the activ shop product list
            setShowSelectProduct(true); // 2. open the selected products of login user
        }
    };

    return (
        <div className="sp-shell">
            <div className="sp-header">
                <ButtonSpList setShowSelectProduct={handleSelected} />
                <div className="prod-count-total-price">
                    <span className="sp-header-shop-name text-bg">
                        {shop?.name}
                    </span>
                    {TOTAL_AMOUNT}
                </div>
                <span className="sp-count text-bg">
                    {SpLists.length} {L.product}
                </span>
                <button className="btn-modal-close" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="sp-page-area">
                {SpLists.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        shop={shop}
                    />
                ))}
            </div>
        </div>
    );
}
