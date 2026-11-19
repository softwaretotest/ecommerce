import { createRecordService } from "@/services/service.record";

const selectProductService = createRecordService("select_products");

export async function loadSpList(uid) {
    if (!uid) return [];

    try {
        const records = await selectProductService.getRecords({
            user_id: uid,
        });

        const matched = Array.isArray(records)
            ? records.find(
                  (item) =>
                      item.user_id === uid ||
                      item.uid === uid ||
                      item.id === uid,
              )
            : null;

        if (!matched) return [];

        if (Array.isArray(matched.select_product)) {
            return matched.select_product;
        }

        if (typeof matched.select_product === "string") {
            try {
                const parsed = JSON.parse(matched.select_product);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }

        return [];
    } catch (error) {
        console.error("Error loading select_products:", error);
        return [];
    }
}

export async function saveSpList(uid, spList) {
    if (!uid) return;

    try {
        const safeList = Array.isArray(spList) ? spList : [];
        const records = await selectProductService.getRecords({
            user_id: uid,
        });

        const existing = Array.isArray(records)
            ? records.find(
                  (item) =>
                      item.user_id === uid ||
                      item.uid === uid ||
                      item.id === uid,
              )
            : null;

        if (existing?.id) {
            await selectProductService.updateRecord(existing.id, {
                user_id: uid,
                select_product: safeList,
            });
        } else {
            await selectProductService.addRecord({
                user_id: uid,
                select_product: safeList,
            });
        }
    } catch (error) {
        console.error("Error saving select_products:", error);
        throw error;
    }
}