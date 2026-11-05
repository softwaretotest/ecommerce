import { storeSpList } from "@/stores/store.global";
import "./select.buttons.css";

export default function ButtonSpList({
    showSelectProduct,
    setShowSelectProduct,
}) {
    const selectProduct = storeSpList((state) => state.select_product);

    const count = selectProduct.reduce((sum, item) => sum + item.qty, 0);

    const handleClick = () => {
        // 💡 เช็กว่าถ้ามีฟังก์ชันส่งลงมา ค่อยสั่งให้ทำงานสลับหน้า
        // แต่ถ้าไม่มี (เช่น ในหน้า Selected) มันจะเงียบนิ่งเฉยๆ ไม่มีแอคชั่น
        if (setShowSelectProduct) {
            setShowSelectProduct(true);
        }
    };

    return (
        <button
            className="btn-select-products btn-icon-only"
            onClick={handleClick}
        >
            🧺
            {count > 0 && <span className="sp-total-amount">{count}</span>}
        </button>
    );
}
