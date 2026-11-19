import { useEffect, useState } from "react";

// 📄 เพิ่ม useEffect ตัวนี้เข้าไปใน record.page.jsx
import { collection, getDocs } from "firebase/firestore"; // ➕ ตรวจสอบให้มีคำสั่ง Import นี้ด้านบน
import { db } from "@/config/config.firebase";

import RecordForm from "@/features/record/record.form";
import RecordList from "@/features/record/record.list";
import useRecordForm from "@/features/record/record.form.hook";
import useController from "./record.controller";
import "@/features/record/record.css";

import ButtonSpList from "@/features/select/btn-select-products";
import Selected from "@/features/select/selected";

import useHighlight from "@/hooks/highlight/useHighlight";
import Modal from "@/components/Modal";
import { useDev } from "@/components/DevProvider";

import { usePermit } from "@/config/config.permit";

import { KEY } from "./record.config";
import { L } from "@/i18n";

import { useAuth } from "@/services/service.auth";

function RecordPage({
    setHeaderConfig,
    store,
    title,
    no_record,
    unit,
    addLabel,
    RECORD_FIELDS,
    PAGE_NAME,
}) {
    const { DEV } = useDev();
    const controller = useController(store);

    const [editRecord, setEditRecord] = useState();

    const { highlight, triggerHighlight } = useHighlight();

    const [active_ShopId, setActive_ShopId] = useState(null);

    const [active_Order, setActive_Order] = useState(null);

    const [showSelectProduct, setShowSelectProduct] = useState(false);

    const formHook = useRecordForm(
        editRecord,
        setEditRecord,
        triggerHighlight,
        RECORD_FIELDS,
        store,
        addLabel,
    );

    const { setShowAddForm, showForm, handleClose } = formHook;

    const { canAdd, isPage_Shop, isPage_Product, isPage_Select } = usePermit(
        PAGE_NAME,
        controller,
    );

    const user = useAuth();

    const userRecords =
        !DEV && (isPage_Shop || isPage_Product)
            ? controller.records.filter(
                  (record) => record?.[KEY.USER_ID] === user?.uid,
              )
            : controller.records;

    // allUsersCarts state to show all selected product in the basket
    const [allUsersCarts, setAllUsersCarts] = useState([]); // เก็บตะกร้าของทุก

    useEffect(() => {
        async function fetchAllCarts() {
            if (DEV && isPage_Product) {
                try {
                    console.log("DEV =", DEV);
                    console.log("isPage_Product =", isPage_Product);
                    const querySnapshot = await getDocs(
                        collection(db, "select_products"),
                    );
                    const temporaryCarts = [];

                    querySnapshot.forEach((doc) => {
                        const userCart = doc.data().select_product || [];
                        temporaryCarts.push(...userCart); // นำมารวมกันเป็นอาร์เรย์ก้อนเดียวยาวๆ
                    });

                    setAllUsersCarts(temporaryCarts);
                } catch (error) {
                    console.error(
                        "Failed to fetch all users carts for DEV:",
                        error,
                    );
                }
            }
        }
        fetchAllCarts();
    }, [DEV, isPage_Product, controller.records.length]);

    useEffect(() => {
        setHeaderConfig({
            title: (
                <>
                    <div className="header-title text-bg">{title}</div>
                </>
            ),
            actions: (
                <>
                    {(canAdd || DEV) && !isPage_Select && (
                        <button
                            className="crud-btn-add"
                            onClick={() => setShowAddForm(true)}
                        >
                            <p className="icon">➕</p>
                            <p className="text">{addLabel}</p>
                        </button>
                    )}
                    {isPage_Select && (
                        <ButtonSpList
                            showSelectProduct={showSelectProduct}
                            setShowSelectProduct={setShowSelectProduct}
                        />
                    )}
                    {(!isPage_Shop || DEV) && (
                        <span className="count text-bg">
                            {userRecords.length} {unit}
                        </span>
                    )}
                </>
            ),
        });
    }, [userRecords.length, setHeaderConfig, canAdd]);

    return (
        <div className="page-container">
            {showForm && (
                <Modal onClose={handleClose}>
                    <RecordForm {...formHook} />
                </Modal>
            )}

            <RecordList
                highlight={highlight}
                setEditRecord={setEditRecord}
                RECORD_FIELDS={RECORD_FIELDS}
                controller={controller}
                title={title}
                no_record={no_record}
                PAGE_NAME={PAGE_NAME}
                active_ShopId={active_ShopId}
                setActive_ShopId={setActive_ShopId}
                active_Order={active_Order}
                setActive_Order={setActive_Order}
                allUsersCarts={allUsersCarts} // ➕ ส่งตะกร้าของทุกคนลงไป
                setShowSelectProduct={setShowSelectProduct}
            />

            {showSelectProduct && ( // ชื่อวาริเอเบิ้ลตาม convention ของคุณ
                <Modal onClose={() => setShowSelectProduct(false)}>
                    <Selected onClose={() => setShowSelectProduct(false)} />
                </Modal>
            )}
        </div>
    );
}

export default RecordPage;
