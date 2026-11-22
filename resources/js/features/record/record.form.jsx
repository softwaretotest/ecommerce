import { useRef, useState } from "react";

import { ImageForm } from "@/components/ImageForm";
import { L } from "@/i18n";
import Preview from "@/components/Preview";
import RecordFormFields from "./record.form.fields";
import { TYPE, KEY } from "@/features/record/record.config";

import { createShopService } from "@/features/shop/shop.service";
import { usePermit } from "@/config/config.permit";
import { PAGE } from "@/config/config.app";
import useController from "./record.controller";
import { storeShop, use_Ecom_Store } from "@/stores/store.global";

function RecordForm(props) {
    const {
        image,
        handleClose,
        form,
        errors,
        touched,
        showEditForm,
        updateField,
        handleBlur,
        submit,
        RECORD_FIELDS,
        addLabel,
    } = props;
    const user = use_Ecom_Store((state) => state.user);

    /**
     * REFs
     *
     * imageRef (new_image)
     * - Used to track REPLACE image state inside ImageForm
     * - Helps verify whether a new image was selected before submit
     */
    const imageRef = useRef(null);

    /**
     * inputRef (AUTO FOCUS)
     * - attached to the "name" in FormField
     */
    const inputRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(null);

    const controller = useController(storeShop);
    const { isPage_Product } = usePermit(PAGE.PRODUCT, controller);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let shop = null;

        if (isPage_Product) {
            const shopService = createShopService();

            shop = shopService.getMyShop(user?.uid);
        }

        const image = imageRef.current?.getResolvedImage?.();

        submit({
            ...form,

            image,

            [KEY.USER_ID]: user?.uid,

            ...(isPage_Product && {
                [KEY.SHOP_ID]: shop?.id,
            }),
        });
    };

    const hasImageConfig = RECORD_FIELDS.some(
        (field) => field.type === TYPE.IMAGE,
    );

    return (
        <form
            className={showEditForm ? "form-edit" : "form-add"}
            onSubmit={handleSubmit}
        >
            {previewImage && hasImageConfig && (
                <Preview
                    className="ifm-img"
                    item={previewImage}
                    onClose={() => setPreviewImage(null)}
                    escapePriority={100}
                />
            )}

            <div className="form-header text-bg">
                {showEditForm ? L.edit : addLabel}
            </div>

            <div className="form-body">
                {hasImageConfig && (
                    <ImageForm
                        ref={imageRef}
                        form={form}
                        image={image}
                        updateField={updateField}
                        submit={submit}
                        setPreviewImage={setPreviewImage}
                    />
                )}

                <div className="form-description text-bg">
                    <RecordFormFields
                        form={form}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                        inputRef={inputRef}
                        updateField={updateField}
                        RECORD_FIELDS={RECORD_FIELDS}
                    />
                </div>

                <div className="form-action">
                    <button className="crud-btn-save" type="submit">
                        {L.save}
                    </button>

                    <button
                        type="button"
                        className="crud-btn-cancel"
                        onClick={handleClose}
                    >
                        {L.cancel}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default RecordForm;
