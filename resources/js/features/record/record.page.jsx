import { useEffect, useState } from "react";

import { createRecordService } from "@/features/record/record.service";

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
import { use_Ecom_Store } from "@/stores/store.global";

const selectProductService = createRecordService("select_products");

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

    const user = use_Ecom_Store((state) => state.user);
    const oauth = use_Ecom_Store((state) => state.oauth);
    const ownerId = user?.id ?? oauth?.user_id;

    const userRecords =
        !DEV && (isPage_Shop || isPage_Product)
            ? controller.records.filter(
                  (record) => record?.[KEY.USER_ID] === ownerId,
              )
            : controller.records;

    const [allUsersCarts, setAllUsersCarts] = useState([]);

    useEffect(() => {
        async function fetchAllCarts() {
            if (DEV && isPage_Product) {
                try {
                    const records = await selectProductService.getRecords();
                    const temporaryCarts = [];

                    if (Array.isArray(records)) {
                        for (const item of records) {
                            const rawCart = item?.select_product;
                            let userCart = [];

                            if (Array.isArray(rawCart)) {
                                userCart = rawCart;
                            } else if (typeof rawCart === "string") {
                                try {
                                    const parsed = JSON.parse(rawCart);
                                    if (Array.isArray(parsed)) {
                                        userCart = parsed;
                                    }
                                } catch {
                                    userCart = [];
                                }
                            }

                            temporaryCarts.push(...userCart);
                        }
                    }

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
                allUsersCarts={allUsersCarts}
                setShowSelectProduct={setShowSelectProduct}
            />

            {showSelectProduct && (
                <Modal onClose={() => setShowSelectProduct(false)}>
                    <Selected onClose={() => setShowSelectProduct(false)} />
                </Modal>
            )}
        </div>
    );
}

export default RecordPage;
