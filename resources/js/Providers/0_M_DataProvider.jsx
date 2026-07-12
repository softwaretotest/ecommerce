// resources/js/Providers/0_M_DataProvider.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/Configs/api";
import { use_M_Store } from "@/Stores/0_M_Store";

export let GLOBAL_METADATA = null;

const MetadataContext = createContext();

export const M_DataProvider = ({ children }) => {
    const M_value_Change = use_M_Store((state) => state.has_M_value_Change);
    const has_M_value_Change = use_M_Store((state) => state.has_M_value_Change);
    const set_has_M_value_Change = use_M_Store(
        (state) => state.set_has_M_value_Change,
    );
    const set_hasJSON_Change = use_M_Store((state) => state.set_hasJSON_Change);

    // useEffect(() => {
    //     // เมื่อ Provider ทำงาน และ Metadata พร้อม
    //     if (GLOBAL_METADATA) {
    //         console.log(
    //             "[DEBUG - refresh M_DataProvider ] - set_M_value in useEffect no dependency }, []); // รันครั้งเดียวตอน App เริ่ม",
    //         );
    //         use_M_Store.getState().set_M_value(GLOBAL_METADATA.m_data);
    //         use_M_Store.getState().initJSON_Content();
    //     }
    // }, []); // รันครั้งเดียวตอน App เริ่ม

    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const M_value = use_M_Store.getState().M_value;

    useEffect(() => {
        console.log(
            "[DEBUG] M_DataProvider detected has_M_value_Change change:",
            has_M_value_Change,
        );
        // get M-Data from API
        fetch(API.M_VALUE_ENDPOINT)
            .then((res) => res.json())
            .then((data) => {
                GLOBAL_METADATA = data; // to use data in normal JS not ReactComponent
                setMetadata(data);
                setLoading(false);
                set_hasJSON_Change(true);
                set_has_M_value_Change(false);
            })
            .catch((err) => {
                console.error("Metadata load error:", err);
                setLoading(false);
            });
    }, [has_M_value_Change]);

    if (loading) return <div>Loading Metadata...</div>;

    return (
        <MetadataContext.Provider value={metadata}>
            {children}
        </MetadataContext.Provider>
    );
};

// Custom Hook to call M-Components
export const use_M_Data = () => useContext(MetadataContext);
