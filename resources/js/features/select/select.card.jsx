import { getFontsizer, isOverflow } from "@/utils/fontsizer";
import "@/utils/fontsizer.css";

import { useState } from "react";

import { L } from "@/i18n";
import { KEY } from "@/features/record/record.config";
import { useOwnerBadge } from "@/features/record/record.owner";
import { formatCurrency, getCurrencyLabel } from "@/i18n";

import "./select.card.css";
import { storeSpList, use_Ecom_Store } from "@/stores/store.global";
import Preview from "@/components/Preview";

import { saveSpList } from "@/features/select/select.service";
import { getUserById } from "@/features/user/user.service";

export default function ProductCard({ product, onClick, shop }) {
    const user = use_Ecom_Store((state) => state.user);

    const [previewItem, setPreviewItem] = useState(null);

    const selectProduct = storeSpList((state) => state.select_product);

    const addProduct = storeSpList((state) => state.addProduct);

    const removeProduct = storeSpList((state) => state.removeProduct);

    const item = selectProduct.find((x) => x.product_id === product.id);

    const qty = item?.qty ?? 0;

    const itemTotalPrice = (Number(product?.[KEY.PRICE]) || 0) * qty;

    const setQty = storeSpList((state) => state.setQty);

    const saveCart = async () => {
        if (!user) return;
        await saveSpList(user?.uid, storeSpList.getState().select_product);
    };

    const handleQtyChange = async (e) => {
        const value = Number(e.target.value);

        if (!Number.isFinite(value)) return;

        setQty(product.id, Math.max(0, Math.floor(value)));

        await saveCart();
    };

    const handleQtyBlur = async (e) => {
        const value = Number(e.target.value);

        setQty(product.id, Math.max(0, Math.floor(value) || 0));
    };

    const countSize = getFontsizer(qty);

    const overflow = isOverflow(qty);

    const ownerUser = getUserById(shop.user_id);
    const ownerName = ownerUser?.[KEY.NAME] || "Unknown";
    const shopName = shop.name;
    const photo = shop.image;
    const OWNER = useOwnerBadge(shopName, ownerName, photo, setPreviewItem);

    return (
        <>
            {previewItem && (
                <Preview
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                    escapeEnabled={true}
                    escapePriority={100}
                />
            )}
            <div
                className="sp-card-container"
                onClick={() => onClick?.(product)}
            >
                <div className="sp-card-header text-bg">
                    {product?.[KEY.NAME]}
                    {OWNER}
                </div>

                <div className="sp-card-body">
                    {product?.[KEY.IMAGE] ? (
                        <img
                            className="sp-img-card text-bg"
                            src={product[KEY.IMAGE]}
                            alt={product[KEY.NAME]}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(product[KEY.IMAGE]);
                            }}
                        />
                    ) : (
                        <div className="img-card text-bg no-image">
                            {L.no_image}
                        </div>
                    )}

                    <div className="sp-card-description text-bg">
                        <p className="label">
                            <span className="label-name">Price:</span>

                            <span className="label-value">
                                {formatCurrency(product?.[KEY.PRICE])}{" "}
                                {getCurrencyLabel()}
                            </span>
                        </p>
                        {/* total price for a product */}
                        <p className="label total-price-row">
                            <span className="label-name">{L.total}:</span>
                            <span className="label-value">
                                {formatCurrency(itemTotalPrice)}{" "}
                                {getCurrencyLabel()}
                            </span>
                        </p>
                    </div>
                    <div className="sp-card-action">
                        <button
                            className="btn-minus"
                            onClick={async () => {
                                removeProduct(product.id);
                                await saveCart();
                            }}
                        >
                            ➖
                        </button>

                        <input
                            className={`sp-input-amount ${countSize} ${
                                overflow ? "count-overflow" : ""
                            }`}
                            type="text"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            value={qty}
                            onChange={handleQtyChange}
                            onBlur={handleQtyBlur}
                        />

                        <button
                            className="btn-plus"
                            onClick={async () => {
                                addProduct(product.id);
                                await saveCart();
                            }}
                        >
                            ➕
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
