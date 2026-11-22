import { useState } from "react";

import { L, formatCurrency, formatNumberLabel, getCurrencyLabel } from "@/i18n";

import { storeUser, use_Ecom_Store } from "@/stores/store.global";

import Preview from "@/components/Preview";
import { useDev } from "@/components/DevProvider";
import Modal from "@/components/Modal";

import { getAllUsersCarts } from "./record.ProductAllUsers";
import { createShopService } from "@/features/shop/shop.service";
import { TYPE, KEY } from "@/features/record/record.config";
import SpList from "@/features/select/select.list";
import OrderList from "@/features/order/order.list";
import { useOwnerBadge } from "@/features/record/record.owner";
import "./record.owner.css";

function RecordCard({
    record,
    setEditRecord,
    highlight,
    onDelete,
    loadingId,
    RECORD_FIELDS,
    isPage_Shop,
    isPage_Product,
    isPage_Select,
    isPage_Order,
    active_ShopId,
    setActive_ShopId,
    active_Order,
    setActive_Order,
    allUsersCarts = [], // ➕ ส่งตะกร้าของทุกคนลงไป
    setShowSelectProduct,
}) {
    const { DEV } = useDev();
    const user = use_Ecom_Store((state) => state.user);
    const users = storeUser((state) => state.records);

    const [previewItem, setPreviewItem] = useState(null);

    const handleDelete = async (id, name) => {
        const ok = window.confirm(`${L.delete} ${name}?`);

        if (!ok) return;

        await onDelete(id);
    };

    const labelText = (field) => {
        const value = record[field.key];

        const label = field.options?.length
            ? (field.options.find((o) => o.value === value)?.label ?? value)
            : value;

        return (
            <p className="label" key={field.key}>
                <span className="label-name">{field.label}:</span>
                <span className="label-value">{label}</span>
            </p>
        );
    };

    const labelOwner = (field) => {
        const ownerId = record?.[field.key];

        const owner = users.find((u) => u.id === ownerId);

        const ownerName = owner?.[KEY.NAME] || user?.displayName || "UNKNOWN";

        return (
            <p className="label" key={field.key}>
                <span className="label-name">{field.label}:</span>

                <span className="label-value">{ownerName}</span>
            </p>
        );
    };

    const labelNumber = (field) => {
        return (
            <p className="label" key={field.key}>
                <span className="label-name">{field.label}:</span>
                <span className="label-value">
                    {formatNumberLabel(record[field.key])} {field.unit}
                </span>
            </p>
        );
    };

    const labelCurrency = (field) => {
        return (
            <p className="label" key={field.key}>
                <span className="label-name">{field.label}:</span>
                <span className="label-value">
                    {formatCurrency(record[field.key])} {getCurrencyLabel()}
                </span>
            </p>
        );
    };

    const card_action = (
        <div className="card-action">
            <button
                className="crud-btn-edit"
                data-tooltip={L.edit}
                onClick={() => setEditRecord(record)}
            >
                <p className="icon">✒️</p>
                <p className="text">{L.edit}</p>
            </button>

            <button
                disabled={loadingId === record.id}
                className="crud-btn-delete"
                onClick={() =>
                    handleDelete(record.id, record[HEADER_FIELD?.key])
                }
            >
                {loadingId === record.id ? (
                    "..."
                ) : (
                    <>
                        <p className="icon">❌</p>
                        <p className="text">{L.delete}</p>
                    </>
                )}
            </button>
        </div>
    );

    /**
     * THE BIG GOLDEN BUTTON TO SHOW MODAL PRODUCT LIST
     * @param {*} btn_name
     * @returns
     */
    function btn_show_product(btn_name) {
        let btnClass = "btn-open-shop-product";

        if (isPage_Order) {
            btnClass = "btn-open-order-list";
        }

        if (isPage_Select) {
            btnClass = "btn-open-shop-product";
        }
        return (
            <button
                className={btnClass}
                onClick={() => {
                    if (isPage_Select) setActive_ShopId(record.id);
                    if (isPage_Order) setActive_Order(record.order_number);
                }}
            >
                <span className="icon-in-btn">📦</span>
                <span className="text-in-btn">{btn_name}</span>
            </button>
        );
    }

    /**
     * filter the RECORD_FIELDS
     */
    const HEADER_FIELD = RECORD_FIELDS.find((field) => field.IS_TITLE);
    const BODY_FIELDS = RECORD_FIELDS.filter((field) => !field.IS_TITLE);
    const BODY_FIELD_RENDERER = (field) => {
        /**
         * TEXT FIELD
         */
        if (
            [
                TYPE.TEXT,
                TYPE.EMAIL,
                TYPE.PHONE,
                TYPE.SELECT,
                TYPE.BOOLEAN,
            ].includes(field.type)
        ) {
            return labelText(field);
        }

        /**
         * NUMBER FIELD
         */
        if (field.type === TYPE.NUMBER) {
            return labelNumber(field);
        }

        /**
         * CURRENCY FIELD
         */
        if (field.type === TYPE.CURRENCY) {
            return labelCurrency(field);
        }

        if (
            isPage_Shop &&
            field.type === TYPE.FID &&
            field.key === KEY.USER_ID
        ) {
            return labelOwner(field);
        }

        return null;
    };
    const card_description = (
        <div className="card-description text-bg">
            {/* card has no more than 2 field to show, 
            user can see data in edit form  */}
            {BODY_FIELDS.slice(0, 2).map(BODY_FIELD_RENDERER)}
        </div>
    );
    const IMAGE_FIELDS = RECORD_FIELDS.filter(
        (field) => field.type === TYPE.IMAGE,
    );
    const hasImageConfig = RECORD_FIELDS.some(
        (field) => field.type === TYPE.IMAGE,
    );

    /**
     * in future a record can have more than 1 image,
     * we use the 1st image to show in card
     */
    const IMAGE = IMAGE_FIELDS[0]?.key;

    let OWNER = null;
    let SELECTED_COUNT = null;

    if (isPage_Product) {
        const ownerUser = users.find(
            (user) => user.id === record?.[KEY.USER_ID],
        );
        const ownerName = ownerUser?.[KEY.NAME] || "Unknown";
        const shopService = createShopService();
        const ownerShop = shopService.getShopById(record?.[KEY.SHOP_ID]);
        const shopName = ownerShop?.[KEY.NAME] || "Unknown Shop";
        const photo = ownerShop?.[KEY.IMAGE];
        OWNER = useOwnerBadge(shopName, ownerName, photo, setPreviewItem);

        /**
         * calculate all product count in all user basket
         */
        SELECTED_COUNT = getAllUsersCarts(
            allUsersCarts,
            isPage_Product,
            record,
            DEV,
        );
    }

    /**
     * ORDER PAGE
     */
    let orderTitle = record[HEADER_FIELD?.key];
    let orderImage = record[KEY.IMAGE];

    if (isPage_Order) {
        const customerData = users.find((u) => u.id === record?.user_id);

        orderImage = customerData?.[KEY.IMAGE] || customerData?.image;

        orderTitle = record?.order_number;
    }

    const RENDER_IMAGE =
        hasImageConfig && (isPage_Order ? orderImage : record[IMAGE]) ? (
            <img
                className="img-card text-bg"
                src={isPage_Order ? orderImage : record[IMAGE]}
                alt={isPage_Order ? orderTitle : record[HEADER_FIELD?.key]}
                onClick={() =>
                    setPreviewItem(isPage_Order ? orderImage : record[IMAGE])
                }
            />
        ) : (
            <div className="img-card text-bg no-image">
                <span>{L.no_image}</span>
            </div>
        );

    return (
        <div
            className={`card-container ${record.id === highlight?.id ? "highlight" : ""}`}
            id={record.id}
        >
            {active_ShopId === record.id && (
                <Modal onClose={() => setActive_ShopId(null)}>
                    <SpList
                        shop_id={record.id}
                        onClose={() => setActive_ShopId(null)}
                        setShowSelectProduct={setShowSelectProduct}
                    />
                </Modal>
            )}

            {active_Order === record.order_number && (
                <Modal onClose={() => setActive_Order(null)}>
                    <OrderList
                        key={record.order_number}
                        user_id={record.user_id}
                        order_number={record.order_number}
                        onClose={() => setActive_Order(null)}
                        setShowSelectProduct={setShowSelectProduct}
                    />
                </Modal>
            )}

            {hasImageConfig && previewItem && (
                <Preview
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                    escapeEnabled={true}
                    escapePriority={100}
                />
            )}

            {record.id === highlight?.id && (
                <span className="badge-new">
                    {highlight?.action === "edit" ? L.update : L.new}
                </span>
            )}
            {SELECTED_COUNT}

            <div className="card-header text-bg">
                {isPage_Order
                    ? record?.order_number
                    : record[HEADER_FIELD?.key]}
                {OWNER}
            </div>
            <div className="card-body">
                {RENDER_IMAGE}

                {!isPage_Select && !isPage_Order && card_description}
                {!isPage_Select && !isPage_Order && card_action}

                {isPage_Select && btn_show_product(L.open_shop_product)}
                {isPage_Order && btn_show_product(L.open_order_product)}
            </div>
        </div>
    );
}

export default RecordCard;
