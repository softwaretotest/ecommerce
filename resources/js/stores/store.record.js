import { create } from "zustand";

import { createRecordService } from "@/services/service.record";

const createRecordStore = (tablename) => {
    const service = createRecordService(tablename);

    const { getRecords, addRecord, updateRecord, deleteRecord } = service;

    return create((set, get) => ({
        records: [],

        loadingId: null,
        isRecordLoading: false,
        recordError: null,

        /**
         * check if records already fetched,
         * no reload records everytime
         * when e.g. page mount/unmount
         */
        hasFetched: false,

        fetch: async () => {
            if (get().hasFetched) return;

            set({
                isRecordLoading: true,
                recordError: null,
            });

            try {
                const list = await getRecords();

                const sortedList = Array.isArray(list)
                    ? [...list].sort((a, b) => {
                          const timeA = Number(a?.created_at ?? 0);
                          const timeB = Number(b?.created_at ?? 0);
                          return timeB - timeA;
                      })
                    : [];

                set({
                    records: sortedList,
                    hasFetched: true,
                });
            } catch (error) {
                set({
                    recordError: error.message,
                });
            } finally {
                set({
                    isRecordLoading: false,
                });
            }
        },

        add: async (data) => {
            const newItem = {
                ...data,
                created_at: Date.now(),
            };

            const created = await addRecord(newItem);
            const id = created?.id ?? created?.data?.id ?? created;
            const recordData =
                created && typeof created === "object" && !Array.isArray(created)
                    ? { ...newItem, ...created, id }
                    : { id, ...newItem };

            set((state) => ({
                records: [recordData, ...state.records],
            }));

            return id;
        },

        update: async (id, data) => {
            const updated = await updateRecord(id, data);
            const patch =
                updated && typeof updated === "object" && !Array.isArray(updated)
                    ? { ...data, ...updated }
                    : data;

            set((state) => ({
                records: state.records.map((p) =>
                    p.id === id ? { ...p, ...patch } : p,
                ),
            }));
        },

        remove: async (id) => {
            set({ loadingId: id });

            try {
                await deleteRecord(id);

                set((state) => ({
                    records: state.records.filter((p) => p.id !== id),
                }));
            } finally {
                set({ loadingId: null });
            }
        },
    }));
};

export default createRecordStore;