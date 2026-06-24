import React, { useState } from 'react';
import { use_M_Data } from '@/Services/0_M_DataProvider';

export default function Dashboard() {
    const m_data = use_M_Data();
    const [activeTab, setActiveTab] = useState('m-data'); // เริ่มต้นที่ พ่อ (M Data)

    const navButtonStyle = (isActive) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#333' : '#ddd',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold'
    });

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h1 style={{ marginBottom: '20px' }}>Project M Dashboard</h1>

            {/* เมนูสลับหน้า: M Data (พ่อ) -> App Data (ลูก) -> Entities (หลาน) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('m-data')} style={navButtonStyle(activeTab === 'm-data')}>M Data</button>
                <button onClick={() => setActiveTab('app')} style={navButtonStyle(activeTab === 'app')}>App Data</button>
                <button onClick={() => setActiveTab('entities')} style={navButtonStyle(activeTab === 'entities')}>Entities</button>
            </div>

            {/* ส่วนแสดงเนื้อหา */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minHeight: '400px' }}>
                {activeTab === 'm-data' && (
                    <div>
                        <h2>M Data (The Origin)</h2>
                        <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
                            {JSON.stringify(m_data?.m_data, null, 2)}
                        </pre>
                    </div>
                )}
                {activeTab === 'app' && (
                    <div>
                        <h2>App Data (The Child)</h2>
                        <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
                            {JSON.stringify(m_data?.app_data, null, 2)}
                        </pre>
                    </div>
                )}
                {activeTab === 'entities' && (
                    <div>
                        <h2>Entities (The Grandchild)</h2>
                        <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
                            {JSON.stringify(m_data?.entities, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}