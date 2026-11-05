import { KEY } from "@/features/record/record.config";

import { productController } from "@/stores/store.global";

export const createProductService = () => {
    /**
     * all products from global store
     */
    const getAllProducts = () => {
        return productController.getRecords();
    };

    /**
     * find product by owner uid
     */
    const getMyProduct = (uid) => {
        const products = getAllProducts();

        return products.find((product) => product?.[KEY.USER_ID] === uid);
    };

    /**
     * find product by product id
     */
    const getProductById = (productId) => {
        const products = getAllProducts();

        return products.find((product) => product.id === productId);
    };

    return {
        getAllProducts,
        getMyProduct,
        getProductById,
    };
};
