import axios from "axios";

export const createRecordService = (tableName) => {
    return {
        getRecords: async () => {
            const res = await axios.get(`/api/records/${tableName}`);
            return res.data;
        },
        // addRecord: async (data) => {
        //     const res = await axios.post(`/api/records/${tableName}`, data);
        //     return res.data.id;
        // },

        addRecord: async (data) => {
            console.log("[addRecord] raw data (before wrap):", data, {
                isFormData: data instanceof FormData,
                imageType: typeof data?.image,
                imageIsFile: data?.image instanceof File,
            });

            const hasFile =
                data &&
                typeof data === "object" &&
                !(data instanceof FormData) &&
                Object.values(data).some(
                    (v) => v instanceof File || v instanceof Blob,
                );

            let payload = data;
            if (hasFile) {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value === undefined || value === null) return;
                    if (value instanceof File || value instanceof Blob) {
                        formData.append(key, value);
                    } else if (typeof value === "object") {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                });
                payload = formData;
            }

            console.log("[addRecord] payload (after wrap):", payload, {
                isFormData: payload instanceof FormData,
                entries:
                    payload instanceof FormData
                        ? Array.from(payload.entries())
                        : undefined,
            });

            const res = await axios.post(`/api/records/${tableName}`, payload);
            return res.data.id;
        },
        updateRecord: async (id, data) => {
            await axios.put(`/api/records/${tableName}/${id}`, data);
        },
        deleteRecord: async (id) => {
            await axios.delete(`/api/records/${tableName}/${id}`);
        },
    };
};
