// Dashboard.jsx

import { Head } from '@inertiajs/react';
import { use_M_Data } from '@/Services/0_M_DataProvider';

export default function Dashboard() {
    const m_data = use_M_Data();

    return (
        <div className="p-10">
            <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">Metadata Test</h1>
            
            {/* show M-Data */}
            <pre className="bg-gray-100 p-4 rounded text-xs">
                {JSON.stringify(m_data, null, 2)}
            </pre>
        </div>
    );
}