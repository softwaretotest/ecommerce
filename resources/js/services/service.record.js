// ตัวอย่าง Axios Service ฝั่ง React ที่จะเอามาแทนที่ service.firestore.js เดิม
import axios from "axios";

export const createRecordService = (tableName) => {
    return {
        getRecords: async () => {
            const res = await axios.get(`/api/records/${tableName}`);
            return res.data;
        },
        addRecord: async (data) => {
            const res = await axios.post(`/api/records/${tableName}`, data);
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
