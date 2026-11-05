import { KEY } from "@/features/record/record.config";

import { shopController } from "@/stores/store.global";

export const createShopService = () => {
    /**
     * all shops from global store
     */
    const getAllShops = () => {
        return shopController.getRecords();
    };

    /**
     * find shop by owner uid
     */
    const getMyShop = (uid) => {
        const shops = getAllShops();

        return shops.find((shop) => shop?.[KEY.USER_ID] === uid);
    };

    /**
     * find shop by shop id
     */
    const getShopById = (shopId) => {
        const shops = getAllShops();

        return shops.find((shop) => shop.id === shopId);
    };

    /**
     * find shop by user id
     */
    const getShopByUserId = (userId) => {
        const shops = getAllShops();

        return shops.find((shop) => shop.user_id === userId);
    };

    return {
        getAllShops,
        getMyShop,
        getShopById,
        getShopByUserId,
    };
};
