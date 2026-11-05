import { useState } from "react";

import { useDev } from "@/components/DevProvider";
import useAppBootstrap from "@/hooks/useAppBootstrap";

import Header from "@/components/Header";
import ProductPage from "@/features/product/product.page";
import ShopPage from "@/features/shop/shop.page";
import UserPage from "@/features/user/user.page";
import OrderPage from "@/features/order/order.page";
import SelectPage from "@/features/select/select.page";

import LoginPageGoogle from "@/flows/login/google/LoginPageGoogle";
import Sidebar from "@/components/Sidebar";
import ButtonSetting from "@/components/ButtonSetting";

export default function App() {
    const { DEV } = useDev();
    const [page, setPage] = useState("customers");
    const [showSidebar, setShowSidebar] = useState(true);
    const [headerConfig, setHeaderConfig] = useState({
        actions: null,
    });

    const handleNavigate = (value) => {
        if (!value) return;
        setPage(value);
        setShowSidebar(true);
    };

    const { theme, setTheme } = useAppBootstrap();

    const renderPage = () => {
        switch (page) {
            case "products":
                return <ProductPage setHeaderConfig={setHeaderConfig} />;

            case "orders":
                return <OrderPage setHeaderConfig={setHeaderConfig} />;

            case "customers":
                return <SelectPage setHeaderConfig={setHeaderConfig} />;

            case "shops":
                return <ShopPage setHeaderConfig={setHeaderConfig} />;

            case "users":
                return <UserPage setHeaderConfig={setHeaderConfig} />;

            default:
                return <SelectPage setHeaderConfig={setHeaderConfig} />;
        }
    };

    return (
        <div className="app-shell">
            {!showSidebar && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setShowSidebar(true)}
                />
            )}
            <div className="header">
                <Header
                    config={headerConfig}
                    ButtonSetting={
                        <ButtonSetting
                            // open,
                            // onClose,
                            theme={theme}
                            setTheme={setTheme}
                        />
                    }
                />
            </div>

            {/* SIDEBAR (ChatGPT style but safe) */}
            <aside className={showSidebar ? "sidebar showSidebar" : "sidebar"}>
                <Sidebar
                    handleNavigate={handleNavigate}
                    showSidebar={showSidebar}
                    onToggle={() => setShowSidebar((v) => !v)}
                    setHeaderConfig={setHeaderConfig}
                    setPage={setPage}
                    setShowSidebar={setShowSidebar}
                />
            </aside>
            <div className="page-area">{renderPage()}</div>
        </div>
    );
}
