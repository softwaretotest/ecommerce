import { useEffect, useState, useMemo } from "react";

import useController from "./record.controller";

import { ImageForm } from "@/components/ImageForm";
import RecordForm from "./record.form";
import { L } from "@/i18n";
import { validateRecord } from "@/utils/ui.validator";

function useRecordForm(
    editRecord,
    setEditRecord,
    triggerHighlight,
    RECORD_FIELDS,
    store,
    addLabel,
) {
    const controller = useController(store);

    /**
     * Build initial form state from schema + existing editRecord
     *
     * This creates the default form values when:
     * - Opening "edit mode" → use existing editRecord values
     * - Opening "create mode" → use defaultValue from schema
     *
     * Fallback order:
     * 1. editRecord value (edit mode)
     * 2. field.defaultValue (schema default)
     * 3. empty string (safe fallback for UI)
     */
    const initialForm = useMemo(() => {
        return RECORD_FIELDS.reduce((accumulator, field) => {
            accumulator[field.key] =
                editRecord?.[field.key] ?? field.defaultValue ?? "";

            return accumulator;
        }, {});
    }, [editRecord, RECORD_FIELDS]);

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [showAddForm, setShowAddForm] = useState(false);

    const showEditForm = Boolean(editRecord);
    const showForm = showAddForm || showEditForm;

    useEffect(() => {
        setForm(initialForm);
        setErrors({});
        setTouched({});
    }, [initialForm, showAddForm]); //clear for for next add

    const hasUnsavedChanges =
        JSON.stringify(form) !== JSON.stringify(initialForm);

    /**
     * Validate Record Fields ----------------------
     */
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const value = form[field];

        updateField(field, typeof value === "string" ? value.trim() : value);
    };

    /**
     * Mark all form fields as "touched"
     *
     * Used when form submission fails validation.
     * This forces all validation errors to be displayed,
     * even for fields the user has not interacted with.
     *
     * Purpose:
     * - Trigger full validation UI feedback
     * - Ensure no hidden validation errors remain unseen
     */
    const markAllTouched = () =>
        RECORD_FIELDS.reduce((acc, field) => {
            acc[field.key] = true;
            return acc;
        }, {});

    /**
     * Build final payload before sending to backend
     *
     * This function transforms UI form state into a clean API-ready object.
     *
     * Responsibilities:
     * - Map form values using schema (RECORD_FIELDS)
     * - Normalize data types for backend consistency
     * - Remove UI-specific representations (e.g. string numbers)
     */
    const buildPayload = (form) =>
        RECORD_FIELDS.reduce((acc, field) => {
            const value = form[field.key];

            // convert numeric fields before save
            if (field.type === "number" || field.type === "currency") {
                acc[field.key] = Number(value);
            } else {
                acc[field.key] = value;
            }

            return acc;
        }, {});

    /**
     * Submit form flow:
     * 1. Validate input editRecord
     * 2. If errors exist → show all fields as touched and stop
     * 3. Convert form editRecord into API payload format
     * 4. Send to backend (create or update)
     */
    const submit = async (customForm = form) => {
        const newErrors = validateRecord(customForm, RECORD_FIELDS); // validate input

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            setTouched(markAllTouched()); // mark all invalid fields
            return false;
        }

        const payload = buildPayload(customForm); // normalize editRecord for backend

        //send to backend
        if (showEditForm) {
            await handleEdit(payload); // update existing editRecord
        } else {
            await handleAdd(payload); // create new editRecord
        }

        return true;
    };

    /**
     * handle UI -----------------------------
     */
    const handleClose = () => {
        if (hasUnsavedChanges) {
            const ok = window.confirm(L.warn_leaving);

            if (!ok) return;
        }

        setShowAddForm(false);

        if (setEditRecord) setEditRecord(null);
    };

    const handleAdd = async (data) => {
        const id = await controller.add(data);

        setShowAddForm(false);

        if (triggerHighlight) {
            triggerHighlight(id, "add");
        }
    };

    const handleEdit = async (data) => {
        if (!editRecord) return;

        await controller.update(editRecord.id, data);

        if (setEditRecord) setEditRecord(null);

        if (triggerHighlight) {
            triggerHighlight(editRecord.id, "edit");
        }
    };

    return {
        // FORM STATE
        form,
        errors,
        touched,
        hasUnsavedChanges,

        // ACTIONS
        updateField,
        handleBlur,
        submit,

        // UI CONTROL
        showForm,
        setShowAddForm,
        showEditForm,

        // HANDLER
        handleClose,

        // DATA + HELPERS
        recordCount: controller.records.length,
        image: editRecord?.image,

        // RECORD_FIELDS
        hasImageConfig: RECORD_FIELDS.some((field) => field.key === "image"),
        RECORD_FIELDS,
        addLabel,
    };
}

export default useRecordForm;
