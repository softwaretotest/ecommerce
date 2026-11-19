import { useState, useEffect, useRef } from "react";
import "./ButtonSetting.css";
import { L } from "@/i18n";
import { assignBackdrop } from "@/utils/backdrop";
import RecordProfile from "@/features/record/record.profile";
// import { deleteUserProfile } from "@/services/service.user"; // old
import { deleteUserProfile } from "@/features/user/user.service";
import { useAuth } from "@/services/service.auth";

export default function ButtonSetting({ setTheme }) {
    const [showSettingItem, setShowSettingItem] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [openKey, setOpenKey] = useState(0);
    const user = useAuth();
    const ref = useRef(null);

    const deleteProfile = () => {
        deleteUserProfile(user?.uid);
    };

    const handleProfile = () => {
        setShowSettingItem(false);
        setShowProfile(true);
        setOpenKey((openCount) => openCount + 1);
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowSettingItem(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {showProfile && (
                <RecordProfile
                    key={openKey} //ChatGPT : React need to see new value to reopen this
                    onClose={() => setShowProfile(false)}
                />
            )}

            {showSettingItem && (
                <div
                    className="setting-backdrop"
                    onClick={() => setShowSettingItem(false)}
                />
            )}

            {/* <div className="setting-backdrop" onClick={onClose} /> */}
            <button
                className={`btn-setting btn-icon-only ${
                    showSettingItem ? "is-active" : ""
                }`}
                onClick={() => {
                    setShowSettingItem((show) => !show);
                    assignBackdrop("setting-backdrop");
                }}
            >
                <span className="display-icon">⚙️</span>
            </button>

            {/* dropdown panel */}
            {showSettingItem && (
                <div className="setting-container">
                    <button
                        className="btn-setting-item"
                        onClick={() => {
                            setTheme((prev) =>
                                prev === "luxury" ? "root" : "luxury",
                            );
                            setShowSettingItem(false);
                        }}
                    >
                        🎨 {L.switch_theme}
                    </button>

                    {user && (
                        <button
                            className="btn-setting-item"
                            onClick={() => {
                                handleProfile();
                                setShowSettingItem(false);
                            }}
                        >
                            👤 {L.profile}
                        </button>
                    )}

                    {user && (
                        <button
                            className="btn-setting-item"
                            onClick={() => {
                                deleteProfile();
                                setShowSettingItem(false);
                            }}
                        >
                            ❌ {L.delete} {L.profile}
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
