import { L } from "@/i18n";

// import { KEY, TYPE, OPTION } from "@/features/record/record.config";
import { KEY, TYPE } from "@/features/record/record.config";

export const USER_FIELDS = [
    {
        key: KEY.NAME,
        label: L.name,
        type: TYPE.TEXT,
        IS_TITLE: true,
        required: true,
    },

    {
        key: KEY.IS_ACTIVE,
        label: L.status,
        type: TYPE.BOOLEAN,
        required: true,
        defaultValue: true,
        options: [
            { value: true, label: L.on },
            { value: false, label: L.off },
        ],
    },

    /**
     * we don't use this but we keep it for test inputSelect() in form.fields
     */
    // {
    //     key: KEY.APP_RIGHT,
    //     label: L.app_right,
    //     type: TYPE.SELECT,
    //     required: true,

    //     options: [
    //         { value: OPTION.HOME, label: L.home },
    //         { value: OPTION.ADMIN, label: L.admin },
    //         { value: OPTION.DEV, label: L.dev },
    //     ],
    //     defaultValue: OPTION.HOME,
    // },

    {
        key: KEY.EMAIL,
        label: L.email,
        type: TYPE.EMAIL,
        // required: true,
    },

    {
        key: KEY.PHONE,
        label: L.phone,
        type: TYPE.PHONE,
    },

    {
        key: KEY.IMAGE,
        type: TYPE.IMAGE,
    },
];
