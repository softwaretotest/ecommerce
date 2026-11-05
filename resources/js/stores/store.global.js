import createRecordStore from "@/stores/store.record";
import { PAGE } from "@/config/config.app";
import storeSpList from "@/features/select/select.store";

const storeUser = createRecordStore(PAGE.USER);
const storeProduct = createRecordStore(PAGE.PRODUCT);
const storeShop = createRecordStore(PAGE.SHOP);
const storeOrder = createRecordStore(PAGE.ORDER);

/**
 * USER CONTROLLER
 */
export const userController = {
    useStore: storeUser,

    getRecords: () => storeUser.getState().records,

    getById: (id) =>
        storeUser.getState().records.find((record) => record.id === id),
};

/**
 * SHOP CONTROLLER
 */
export const shopController = {
    useStore: storeShop,

    getRecords: () => storeShop.getState().records,

    getById: (id) =>
        storeShop.getState().records.find((record) => record.id === id),
};

/**
 * PRODUCT CONTROLLER
 */
export const productController = {
    useStore: storeProduct,

    getRecords: () => storeProduct.getState().records,

    getById: (id) =>
        storeProduct.getState().records.find((record) => record.id === id),
};

/**
 * PRODUCT CONTROLLER
 */
export const orderController = {
    useStore: storeOrder,

    getRecords: () => storeOrder.getState().records,

    getById: (id) =>
        storeOrder.getState().records.find((record) => record.id === id),
};

/**
 * optional exports (stores)
 */
export { storeUser, storeProduct, storeShop, storeOrder, storeSpList };
