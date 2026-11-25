import {
    useEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import { compressImage } from "@/utils/image";
import "./ImageForm.css";
import { L } from "@/i18n"; //import Language from host App, remove if not use L
import Preview from "@/components/Preview";

// // Convert File object to a temporary object URL for <img> rendering.
// const toPreviewSrc = (value) => {
//     if (!value) return "";
//     if (value instanceof File) {
//         return URL.createObjectURL(value);
//     }
//     return value;
// };

// Convert File object to a temporary object URL for <img> rendering.
const toPreviewSrc = (value) => {
    console.log("[toPreviewSrc] value:", value, {
        type: typeof value,
        isFile: value instanceof File,
        isBlob: value instanceof Blob,
        length: typeof value === "string" ? value.length : undefined,
    });

    if (!value) return "";
    if (value instanceof File) {
        return URL.createObjectURL(value);
    }
    return value;
};

/**
- RecordForm / ImageForm - IMAGE STATE MACHINE
- ---------------------------------------------------------
 *
- This component implements a deterministic image state system
- for record create/edit flows.
 *
- It supports 3 core states:
 *
- 1. CASE A: First image upload (unsaved record)
- 2. CASE B: Existing image (edit mode)
- 3. CASE B1/B2: delete / replace transitions
 *
- ---------------------------------------------------------
- KEY DESIGN PRINCIPLE
- ---------------------------------------------------------
 *
- UI state is NOT the same as persisted DB state.
 *
- - form?.image      → primary persisted/active image
- - form?.image_new  → temporary replacement (UI-only)
- - showDeleteOverlay → soft delete intention flag
 *
- Only ONE final image is ever submitted.
 */

/**
- React rule for pass parameters : 
- export const ImageForm = forwardRef(({ prop }, ref) => {
        return ( some HTML );
    });
- forwardRef must destructure props first, then ref is injected separately
 */
export const ImageForm = forwardRef(
    ({ form, image, updateField, setPreviewImage }, ref) => {
        /**
- IMAGE STATE (derived)
- ---------------------------------------------------------
         *
- currentImage:
- → active image shown in UI
- → source: form?.image
         *
- newImage:
- → replacement preview image (temporary state only)
- → source: form?.image_new
         *
- hasSavedImage:
- → true if record already exists in DB
         *
- hasUnsavedFirstImage:
- → special CASE A detection (first upload before save)
         */

        const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

        const currentImage = form?.image;
        const newImage = form?.image_new;

        const hasSavedImage = Boolean(image);

        const hasUnsavedFirstImage = currentImage && !hasSavedImage;

        const fileInputRef = useRef(null);

        const currentImageSrc = useMemo(
            () => toPreviewSrc(currentImage),
            [currentImage],
        );
        const newImageSrc = useMemo(() => toPreviewSrc(newImage), [newImage]);

        useEffect(() => {
            return () => {
                if (
                    currentImage instanceof File &&
                    typeof currentImageSrc === "string" &&
                    currentImageSrc.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(currentImageSrc);
                }
            };
        }, [currentImage, currentImageSrc]);

        useEffect(() => {
            return () => {
                if (
                    newImage instanceof File &&
                    typeof newImageSrc === "string" &&
                    newImageSrc.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(newImageSrc);
                }
            };
        }, [newImage, newImageSrc]);

        /**
- IMAGE UPLOAD / REPLACEMENT HANDLER
- ---------------------------------------------------------
         *
- Handles both:
- - CASE A: first image upload
- - CASE B2: replacement image upload
         */
        const handleImageChange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const compressedImage = await compressImage(file, 200);

            /**
- Reset file input to allow re-upload of same file
             */
            event.target.value = "";

            /**
- CASE A: First image upload
- -----------------------------------------------------
- No existing image → store directly into form?.image
             *
- No image_new is created in this flow.
             */
            if (!currentImage) {
                updateField("image", compressedImage);
                return;
            }

            /**
- CASE B2: Replacement image
- -----------------------------------------------------
- Create temporary preview state only
             *
- image_new is introduced here as UI-only layer
             */
            updateField("image_new", compressedImage);
        };

        /**
- IMAGE DELETE INTENT HANDLER
- ---------------------------------------------------------
         *
- This does NOT immediately delete DB data.
- It only sets user intent.
         */
        const handleDeleteImage = () => {
            /**
- CASE A:
- Unsaved first image
- → delete immediately (no DB involvement)
             */
            if (currentImage && !image) {
                updateField("image", "");
                return;
            }

            /**
- CASE B1:
- Existing DB image
- → mark for deletion (soft state)
             */
            setShowDeleteOverlay(true);
        };

        /**
- UNDO STATE HANDLER
- ---------------------------------------------------------
         *
- Restores previous image state depending on flow:
- - removes replacement preview (image_new)
- - clears delete overlay flag
         */
        const handleUndoDelete = () => {
            /**
- CASE B2.2:
- Remove replacement image (if exists)
             */
            if (newImage) {
                updateField("image_new", "");
            }

            /**
- CASE B1:
- Remove delete intent
             */
            setShowDeleteOverlay(false);
        };

        /**
- TRIGGER FILE INPUT
         */
        const handleUploadImage = () => {
            fileInputRef.current.click();
        };

        /**
- IMAGE RESOLUTION ENGINE (FINAL DECISION LAYER)
- ---------------------------------------------------------
         *
- This is the ONLY function used by RecordForm during submit.
         *
- It resolves:
- - delete state
- - replacement state
- - default state
         *
- This replaces old inline logic:
         *
- showDeleteOverlay ? "" : form?.image_new || form?.image
         */
        useImperativeHandle(ref, () => ({
            getResolvedImage: () => {
                /**
- CASE B1:
- DELETE OVERRIDES EVERYTHING
                 *
- No matter what exists in:
- - image
- - image_new
                 *
- result is always empty string
                 */
                if (showDeleteOverlay) return "";

                /**
- CASE B2:
- REPLACEMENT IMAGE TAKES PRIORITY OVER ORIGINAL
                 *
- image_new is temporary UI state only
                 */
                if (newImage) return newImage;

                /**
- CASE A / DEFAULT:
- fallback to original image
                 */
                return currentImage;
            },
        }));

        /**
-  PARTS OF ImageForm
         */

        const CaseA_HAS_Image____overlay_CROSS = currentImage ? (
            <div className="ifm-container-wrapper">
                <img
                    className="ifm-img"
                    src={currentImageSrc}
                    onClick={() => setPreviewImage(currentImageSrc)}
                />

                {/* Overlay shown when image is inactive (delete or replaced) */}
                {(showDeleteOverlay || newImage) && (
                    <div className="ifm-cross-overlay">❌</div>
                )}
            </div>
        ) : (
            <div className="ifm-img ifm-no-image" onClick={handleUploadImage}>
                <span>{L.no_image}</span>
            </div>
        );

        const CaseA_NO_Image____btn_PLUS = !currentImage && (
            <button
                className="ifm-icon-only"
                type="button"
                onClick={handleUploadImage}
            >
                ➕
            </button>
        );

        const CaseA_HAS_Image____btn_CROSS = hasUnsavedFirstImage && (
            <button
                className="ifm-icon-only"
                type="button"
                onClick={handleDeleteImage}
            >
                ❌
            </button>
        );

        const CaseB_HAS_Image____btn_CROSS_REPLACE = hasSavedImage &&
            !showDeleteOverlay &&
            !newImage && (
                <>
                    <button
                        className="ifm-icon-only"
                        type="button"
                        onClick={handleDeleteImage}
                    >
                        ❌
                    </button>

                    <button
                        className="ifm-icon-only"
                        type="button"
                        onClick={handleUploadImage}
                    >
                        🖼️
                    </button>
                </>
            );

        const CaseB_HAS_Image____overlay_CROSS_btn_UNDONE =
            (showDeleteOverlay || newImage) && (
                <button
                    className="ifm-icon-only"
                    type="button"
                    onClick={handleUndoDelete}
                >
                    ↩️
                </button>
            );

        const CaseB_NEW_Image____input_hidden = (
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
            />
        );

        const CaseB_NEW_Image____img = image && (
            <>
                {newImage ? (
                    <img
                        className="ifm-img"
                        src={newImageSrc}
                        alt="preview"
                        onClick={() => setPreviewImage(newImageSrc)}
                    />
                ) : (
                    <div
                        className="ifm-img ifm-no-image"
                        onClick={handleUploadImage}
                    >
                        <span>{L.new_image}</span>
                    </div>
                )}
            </>
        );

        return (
            <>
                {/* IMAGE CONTAINER , need CSS from host App for background*/}
                <div className="ifm-container text-bg">
                    <div className="ifm-header">{L.upload_image}</div>

                    <div className="ifm-body">
                        {/* CURRENT IMAGE DISPLAY */}
                        {CaseA_HAS_Image____overlay_CROSS}

                        {/* UPLOAD BUTTON (only when no image exists) */}
                        {CaseA_NO_Image____btn_PLUS}

                        {/* CASE A UI ACTIONS */}
                        {CaseA_HAS_Image____btn_CROSS}

                        {/* CASE B UI ACTIONS */}
                        {CaseB_HAS_Image____btn_CROSS_REPLACE}

                        {/* UNDO BUTTON (delete or replace state) */}
                        {CaseB_HAS_Image____overlay_CROSS_btn_UNDONE}

                        {/* HIDDEN FILE INPUT */}
                        {CaseB_NEW_Image____input_hidden}

                        {/* REPLACEMENT PREVIEW PANEL */}
                        {CaseB_NEW_Image____img}
                    </div>
                </div>
            </>
        );
    },
);
