// 0_M_DataProvider.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';

const MetadataContext = createContext();

export const M_DataProvider = ({ children }) => {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // get M-Data from API
        fetch('/api/m-data')
            .then((res) => res.json())
            .then((data) => {
                setMetadata(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Metadata load error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading Metadata...</div>;

    return (
        <MetadataContext.Provider value={metadata}>
            {children}
        </MetadataContext.Provider>
    );
};

// Custom Hook to call M-Components
export const use_M_Data = () => useContext(MetadataContext);