import { useState, useEffect } from "react";

import useAppBootstrap from "@/hooks/useAppBootstrap";

import Header from "@/components/Header";
import ProductPage from "@/features/product/product.page";
import ShopPage from "@/features/shop/shop.page";
import UserPage from "@/features/user/user.page";
import OrderPage from "@/features/order/order.page";
import SelectPage from "@/features/select/select.page";

import Sidebar from "@/components/Sidebar";
import ButtonSetting from "@/components/ButtonSetting";

import { use_Ecom_Store } from "@/stores/store.global";

import { startAuthListener } from "@/flows/google/google.login";

export default function App() {
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

    const set_user = use_Ecom_Store.getState().set_user;
    const set_oauth = use_Ecom_Store.getState().set_oauth;

    /**
     * ```text
     * MAIN AUTH HOOK
     * x
     * This useEffect hook subscribes to authentication state changes
     * when the component mounts and cleans up the subscription when it unmounts:
     * 1. On mount ([] dependencies): Calls startAuthListener
     * and passes a set_user callback so auth state updates (u) update local user state.
     * It stores the returned cleanup function in unsubscribe.
     * x
     * 2. On unmount: Returns a cleanup function
     * that safely invokes unsubscribe?.() to detach the listener
     * and prevent stale updates or memory leaks.
     */
    // useEffect(() => {
    //     const unsubscribe = startAuthListener({
    //         set_user: (u) => {
    //             set_user(u);
    //         },
    //         set_oauth: (u) => {
    //             set_oauth(u);
    //         },
    //     });

    //     return () => {
    //         unsubscribe?.();
    //     };
    // }, []);
    useEffect(() => {
        const unsubscribe = startAuthListener({
            set_user: (nextUser) => {
                set_user(nextUser);
            },
            set_oauth: (nextOauth) => {
                set_oauth(nextOauth);
            },
        });

        return () => {
            unsubscribe?.();
        };
    }, []);

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
