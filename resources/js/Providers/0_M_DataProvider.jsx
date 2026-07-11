// resources/js/Providers/0_M_DataProvider.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/Configs/api";
import { use_M_Store } from "@/Stores/0_M_Store";

export let GLOBAL_METADATA = null;

const MetadataContext = createContext();

export const M_DataProvider = ({ children }) => {
    useEffect(() => {
        // เมื่อ Provider ทำงาน และ Metadata พร้อม
        if (GLOBAL_METADATA) {
            use_M_Store.getState().set_M_value(GLOBAL_METADATA.m_data);
            use_M_Store.getState().initJSON_Content();
        }
    }, []); // รันครั้งเดียวตอน App เริ่ม

    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const M_value = use_M_Store.getState().M_value;

    useEffect(() => {
        // get M-Data from API
        fetch(API.M_VALUE_ENDPOINT)
            .then((res) => res.json())
            .then((data) => {
                GLOBAL_METADATA = data; // to use data in normal JS not ReactComponent
                setMetadata(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Metadata load error:", err);
                setLoading(false);
            });
    }, [M_value]);

    if (loading) return <div>Loading Metadata...</div>;

    return (
        <MetadataContext.Provider value={metadata}>
            {children}
        </MetadataContext.Provider>
    );
};

// Custom Hook to call M-Components
export const use_M_Data = () => useContext(MetadataContext);
