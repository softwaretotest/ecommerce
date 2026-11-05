import { L } from "@/i18n";
import { KEY, TYPE } from "@/features/record/record.config";
export const ORDER_FIELDS = [
    {
        key: KEY.ORDER_NR,
        label: L.piece,
        type: TYPE.NUMBER,
        IS_TITLE: true,
    },
    {
        key: KEY.USER_ID,
        label: L.customer,
        type: TYPE.FID,
    },
    {
        key: KEY.PRODUCT_ID,
        label: L.product,
        type: TYPE.FID,
    },
    {
        key: KEY.QUANTITY,
        label: L.piece,
        type: TYPE.NUMBER,
    },
    {
        key: KEY.IMAGE,
        type: TYPE.IMAGE,
    },
    {
        key: KEY.CONFIRM_ORDER,
        label: L.confirm_order,
        type: TYPE.BOOLEAN,
    },
];
