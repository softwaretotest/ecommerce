import { create } from "zustand";

import { createFirestoreService } from "@/services/service.firestore";

const createRecordStore = (tablename) => {
    const service = createFirestoreService(tablename);

    const { getRecords, addRecord, updateRecord, deleteRecord } = service;

    return create((set, get) => ({
        records: [],

        loadingId: null,
        isRecordLoading: false, //waiting until loading finish
        recordError: null, // error e.g. no connection to db

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

                list.sort((a, b) => b.created_at - a.created_at);

                set({
                    records: list,
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

            const id = await addRecord(newItem);

            set((state) => ({
                records: [{ id, ...newItem }, ...state.records],
            }));

            return id;
        },

        update: async (id, data) => {
            await updateRecord(id, data);

            set((state) => ({
                records: state.records.map((p) =>
                    p.id === id ? { ...p, ...data } : p,
                ),
            }));
        },

        remove: async (id) => {
            set({ loadingId: id });

            await deleteRecord(id);

            set((state) => ({
                records: state.records.filter((p) => p.id !== id),
                loadingId: null,
            }));
        },
    }));
};

export default createRecordStore;
