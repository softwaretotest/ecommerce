import { L, getCurrencyLabel } from "@/i18n";
import { KEY, TYPE } from "@/features/record/record.config";
export const PRODUCT_FIELDS = [
    {
        key: KEY.NAME,
        label: L.name,
        type: TYPE.TEXT,
        IS_TITLE: true,
        required: true,
    },
    {
        key: KEY.PRICE,
        label: L.price,
        type: TYPE.CURRENCY,
        unit: getCurrencyLabel(),
        required: true,
    },
    {
        key: KEY.STOCK,
        label: L.stock,
        type: TYPE.NUMBER,
        unit: L.piece,
        required: true,
    },
    {
        key: KEY.USER_ID,
        label: L.owner,
        type: TYPE.FID,
    },
    {
        key: KEY.SHOP_ID,
        label: L.shop,
        type: TYPE.FID,
    },
    {
        key: KEY.IMAGE,
        type: TYPE.IMAGE,
    },
];
