import { useState } from "react";
import { L, formatCurrency, getCurrencyLabel } from "@/i18n";
import { KEY } from "@/features/record/record.config";
import { productController, shopController } from "@/stores/store.global";
import Preview from "@/components/Preview";
import "@/features/select/select.card.css";
import { useOwnerBadge } from "@/features/record/record.owner";
import { getUserById } from "@/features/user/user.service";

export default function OrderCard({ order }) {
    const [previewItem, setPreviewItem] = useState(null);

    const products = productController.getRecords();
    const product = products.find((p) => p.id === order?.product_id);
    const shop = shopController.getById(order?.shop_id);

    const qty = Number(order?.quantity) || 0;
    const price = Number(product?.[KEY.PRICE]) || 0;
    const itemTotalPrice = price * qty;

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
            <div className="sp-card-container">
                <div className="sp-card-header text-bg">
                    {product?.[KEY.NAME] || "Unknown Product"}
                    <span
                        className="text-bg"
                        style={{
                            fontSize: "12px",
                            marginLeft: "10px",
                            color: "var(--color-primary)",
                        }}
                    >
                        {OWNER}
                    </span>
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
                                {formatCurrency(price)} {getCurrencyLabel()}
                            </span>
                        </p>
                        <p className="label">
                            <span className="label-name">
                                {L.piece || "Qty"}:
                            </span>
                            <span className="label-value">{qty}</span>
                        </p>
                        <p className="label total-price-row">
                            <span className="label-name">{L.total}:</span>
                            <span className="label-value">
                                {formatCurrency(itemTotalPrice)}{" "}
                                {getCurrencyLabel()}
                            </span>
                        </p>
                    </div>
                    <div
                        className="sp-card-action"
                        style={{
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    >
                        <span className="text-bg">
                            {L.status}:{" "}
                            {order?.status === "confirmed"
                                ? "✅ " + L.confirm_order
                                : "⏳ " + L.pending}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
