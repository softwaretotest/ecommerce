import { L } from "@/i18n";
import "./Sidebar.css";
import { PAGE } from "@/config/config.app";
import { useDev } from "@/components/DevProvider";
import { assignBackdrop } from "@/utils/backdrop";
import { login, logout, openChromeFromLine } from "@/services/service.auth";
import { usePermit } from "@/config/config.permit";
import { useAuth } from "@/services/service.auth";
import { storeSpList } from "@/stores/store.global";

export default function Sidebar({
    handleNavigate,
    showSidebar,
    onToggle,
    setPage,
    setShowSidebar,
}) {
    const { DEV } = useDev();
    const { hasShop } = usePermit(PAGE.SHOP);
    const { hasProduct } = usePermit(PAGE.ORDER);

    const menuItems = [
        { label: L.product, value: "products", icon: "📦", permit: hasShop },

        { label: L.user, value: "users", icon: "⚙️", dev: true },
        {
            label: L.order,
            value: "orders",
            icon: "📜",
            permit: DEV || hasProduct,
        },
        { label: L.customer, value: "customers", icon: "👨‍👩‍👧‍👦" },
    ];

    function handleAccess() {
        setPage?.(null);
        setShowSidebar?.(true);
        storeSpList.getState().clearCart();
    }

    const user = useAuth();

    const handleClick = (value) => {
        handleNavigate(value);
        assignBackdrop("sidebar");
    };

    return (
        <div className="sidebar-container">
            {/* TOGGLE BUTTON */}
            <button className="sidebar-btn-menu" onClick={onToggle}>
                {showSidebar ? "☰" : "✕"}
            </button>
            {menuItems
                .filter((item) => {
                    // DEV ONLY
                    if (item.dev && !DEV) {
                        return false;
                    }

                    // PERMIT
                    if (item.permit === false) {
                        return false;
                    }

                    return true;
                })
                .map((item) => (
                    <button
                        key={item.value}
                        className="sidebar-btn-item"
                        onClick={() => handleClick(item.value)}
                    >
                        {item.icon}
                        {!showSidebar && (
                            <span className="label">{item.label}</span>
                        )}
                    </button>
                ))}

            {/* LOG OUT + SHOW BUTTON*/}
            {user && (
                <>
                    <button
                        className="sidebar-btn-item"
                        onClick={() => handleClick(PAGE.SHOP)}
                    >
                        🏠
                        {!showSidebar && (
                            <span className="label">{L.shop}</span>
                        )}
                    </button>

                    <button
                        className="sidebar-btn-item"
                        onClick={async () => {
                            await logout();
                            handleAccess();
                        }}
                    >
                        🚪
                        {!showSidebar && (
                            <span className="label">{L.logout}</span>
                        )}
                    </button>
                </>
            )}

            {/* LOG IN */}
            {!user && (
                <button
                    className="sidebar-btn-item"
                    onClick={async () => {
                        const ok = await openChromeFromLine();
                        if (!ok) return;
                        await login();
                        handleAccess();
                    }}
                >
                    🔑
                    {!showSidebar && <span className="label">{L.login}</span>}
                </button>
            )}
        </div>
    );
}
