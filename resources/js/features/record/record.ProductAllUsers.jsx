/**
 * calculate all product count in all user basket
 */
export function getAllUsersCarts(allUsersCarts, isPage_Product, record, DEV) {
    const totalQtyAcrossAllUsers = allUsersCarts
        .filter((item) => item.product_id === record.id)
        .reduce((sum, item) => sum + item.qty, 0);

    const SELECTED_COUNT = DEV &&
        isPage_Product &&
        totalQtyAcrossAllUsers > 0 && (
            <span
                className="sp-total-amount"
                style={{
                    position: "absolute",
                    left: "-5px",
                    top: "-5px",
                    fontSize: "12px",
                    padding: "2px 6px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    zIndex: 10,
                }}
            >
                {totalQtyAcrossAllUsers}
            </span>
        );
    return SELECTED_COUNT;
}
