//record.config.js

export const TYPE = Object.freeze({
    TEXT: "text",

    NUMBER: "number",

    EMAIL: "email",

    SELECT: "select",

    BOOLEAN: "boolean",

    CURRENCY: "currency",

    IMAGE: "image",

    FID: "foreign_key",
});

export const KEY = Object.freeze({
    NAME: "name",

    EMAIL: TYPE.EMAIL,

    PHONE: "phone",

    // APP_RIGHT: "app_right",

    IS_ACTIVE: "is_active",

    PRICE: "price",

    QUANTITY: "quantity",

    STOCK: "stock",

    IMAGE: TYPE.IMAGE,

    IS_TITLE: true,

    USER_ID: "user_id",

    SHOP_ID: "shop_id",

    PRODUCT_ID: "product_id",

    ORDER_NR: "order_nr",

    CONFIRM_ORDER: "confirm_order",

    UID: "uid",
});
