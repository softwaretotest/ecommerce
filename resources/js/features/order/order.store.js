import { create } from "zustand";

const storeOrderList = create((set, get) => {
    return {
        // 🎯 ตารางอาเรย์หลักสำหรับรับข้อมูลคำสั่งซื้อดิบทั้งหมดมาจากคลาวด์ Firebase
        orders: [],

        // 💡 ฟังก์ชันสำหรับดาวน์โหลดสเตตออเดอร์จาก DB ยัดลงเครื่องคอมพิวเตอร์
        setOrders: (orders) => {
            set({ orders });
        },

        // 💡 ฟังก์ชันล้างประวัติคำสั่งซื้อทั้งหมดในเครื่องให้โล่งสะอาดเป็นค่าว่าง
        clearOrders: () => {
            set({ orders: [] });
        },
    };
});

export default storeOrderList;
