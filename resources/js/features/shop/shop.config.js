import { L } from "@/i18n";
import { KEY, TYPE } from "@/features/record/record.config";
export const SHOP_FIELDS = [
    {
        key: KEY.NAME,
        label: L.name,
        type: TYPE.TEXT,
        IS_TITLE: true,
        required: true,
    },
    {
        key: KEY.USER_ID,
        label: L.owner,
        type: TYPE.FID,
    },
    {
        key: KEY.IMAGE,
        type: TYPE.IMAGE,
    },
];
