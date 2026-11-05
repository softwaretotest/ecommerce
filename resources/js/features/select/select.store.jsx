import { create } from "zustand";

const COLLECTION = "select_products";

const storeSpList = create((set, get) => {
    return {
        select_product: [],

        /**
         * user push + button on a product card in the modal select.product
         */
        addProduct: (product_id) => {
            set((state) => {
                const item = state.select_product.find(
                    (item) => item.product_id === product_id,
                );

                if (item) {
                    // case product already exist in the basket
                    const updated = state.select_product.map((item) =>
                        item.product_id === product_id
                            ? { ...item, qty: item.qty + 1 }
                            : item,
                    );

                    return { select_product: updated };
                }

                const updated = [
                    // case product not exist
                    ...state.select_product,
                    { product_id, qty: 1 }, // then add new
                ];

                return { select_product: updated };
            });
        },

        setSpList: (select_product) => {
            set({ select_product });
        },

        /**
         * when user change quantity direct in the <input />
         */
        setQty: (productId, qty) => {
            const result =
                qty <= 0 //if quantity = 0
                    ? get().select_product.filter(
                          (item) => item.product_id !== productId, // then remove from basket
                      )
                    : get().select_product.some(
                            // some = find and return true/false
                            (item) => item.product_id === productId, // if quantity > 0
                        )
                      ? get().select_product.map((item) =>
                            item.product_id === productId
                                ? { ...item, qty } // then update quantity of the product
                                : item,
                        )
                      : [
                            //if product not found in the basket
                            ...get().select_product,
                            {
                                product_id: productId, //then add product into the basket
                                qty,
                            },
                        ];

            set({ select_product: result });
        },

        /**
         * user push - button on a product card in the modal select.product
         */
        removeProduct: (product_id) => {
            const result = get()
                .select_product.map((item) =>
                    item.product_id === product_id
                        ? { ...item, qty: item.qty - 1 } //minus button click once , quantity - 1
                        : item,
                )
                .filter((item) => item.qty > 0); // and return only product which quantity > 0

            set({ select_product: result });
        },

        clearCart: () => {
            set({ select_product: [] });
        },
    };
});

export default storeSpList;
