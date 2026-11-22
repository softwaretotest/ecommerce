import { PAGE } from "@/config/config.app";
import { KEY } from "@/features/record/record.config";
import useController from "@/features/record/record.controller";
import { productController } from "@/stores/store.global";

import {
    storeShop,
    storeProduct,
    storeUser,
    storeOrder,
    use_Ecom_Store,
} from "@/stores/store.global";

/**
 * usePermit make UI rules for all pages in this App
 * @param {*} PAGE_NAME
 * @param {*} controller
 * @returns
 */
export const usePermit = (PAGE_NAME, controller = null) => {
    const storeMap = {
        [PAGE.USER]: storeUser,
        [PAGE.SHOP]: storeShop,
        [PAGE.PRODUCT]: storeProduct,
        [PAGE.HOME]: storeShop,
        [PAGE.ORDER]: storeOrder,
    };

    const user = use_Ecom_Store((state) => state.user);

    if (!controller) {
        const store = storeMap[PAGE_NAME];

        controller = useController(store);
    }
    const records = controller?.records || [];

    const isPage_Shop = PAGE_NAME === PAGE.SHOP;
    const isPage_Product = PAGE_NAME === PAGE.PRODUCT;
    const isPage_Select = PAGE_NAME === PAGE.HOME;
    const isPage_Order = PAGE_NAME === PAGE.ORDER;

    /**
     *  SHOP
     */
    const hasShop = (() => {
        if (!isPage_Shop) return false;
        for (let i = 0; i < records.length; i++) {
            const shop = records[i];

            const shopOwnerId = shop?.[KEY.USER_ID];

            if (shopOwnerId === user?.uid) {
                return true; // found → exit immediately
            }
        }
        return false;
    })();

    const canAdd_Shop = isPage_Shop && !hasShop;

    /**
     *  PRODUCT
     */
    const canAdd_Product = isPage_Product && user?.uid;

    const hasProduct = (() => {
        if (!isPage_Order || !user) return false;

        const products = productController?.getRecords();
        const hasSomeProduct = products.some(
            (item) => item.user_id === user?.uid,
        );

        return hasSomeProduct;
    })();

    /**
     *  CAN ADD record , e.g. for showing add button
     *  should be used only in List not in Card
     *  because List makes Card
     *
     *  if filter isPage in Card , the result could be unpredictable
     */
    const canAdd = canAdd_Shop || canAdd_Product;

    if (isPage_Shop) {
        // console.log("records.length = ", records.length);
        // console.log("hasShop = ", hasShop);
        // console.log("canAdd_Shop = ", canAdd_Shop);
        // console.log("canAdd_Product = ", canAdd_Product);
    }

    return {
        canAdd,
        hasShop,
        hasProduct,
        isPage_Shop,
        isPage_Product,
        isPage_Select,
        isPage_Order,
    };
};
