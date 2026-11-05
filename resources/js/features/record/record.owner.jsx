import { useState } from "react";
import { L } from "@/i18n";

export function useOwnerBadge(shopName, ownerName, photo, setPreviewItem) {
    const [isOpen, setIsOpen] = useState(false);

    // 💡 ฟังก์ชันจัดการคลิกที่ตัวกล่องแคปซูลหลัก
    const handleContainerClick = (e) => {
        // ถ้าลิ้นชักกางอยู่ แตะตรงไหนในกรอบนี้ก็นับเพื่อสั่งปิดทันที
        if (isOpen) {
            setIsOpen(false);
        }
    };

    // 💡 ฟังก์ชันเฉพาะตอนกดปุ่มเปิด/ปิด
    const handleToggleBtnClick = (e) => {
        e.stopPropagation(); // กันไม่ให้เหตุการณ์วิ่งซ้ำซ้อน
        setIsOpen(!isOpen);
    };

    return (
        <div
            // เมื่อเปิดอยู่ (isOpen) จะเข้าเงื่อนไข แตะตรงไหนก็ได้ในกรอบเพื่อปิด
            className={`card-owner ${isOpen ? "sp-owner-open" : ""}`}
            title={`${L.shop}: ${shopName}\n${L.user}: ${ownerName}`}
            onClick={handleContainerClick}
        >
            {photo && (
                <img
                    className="card-owner-img"
                    src={photo}
                    alt={shopName}
                    onClick={(e) => {
                        // 💡 สำคัญ: ถ้าลิ้นชักเปิดอยู่ ให้แตะรูปเพื่อปิดแถบแทน แต่ถ้าปิดอยู่ ให้เปิดพรีวิวภาพใหญ่ตามปกติ
                        if (isOpen) {
                            setIsOpen(false);
                        } else {
                            setPreviewItem(photo);
                        }
                    }}
                />
            )}

            {/* ปุ่มกดเปิด/ปิด ที่สลับสัญลักษณ์และมีขนาดใหญ่ขึ้น */}
            <button
                className="card-owner-toggle-btn"
                onClick={handleToggleBtnClick}
                type="button"
            >
                {isOpen ? "✕" : "ℹ️"}
            </button>

            <div className="card-owner-info">
                <p className="card-owner-shop">{shopName}</p>
                <p className="card-owner-name">{ownerName}</p>
            </div>
        </div>
    );
}
