import { use_M_Data } from "@/Services/0_M_DataProvider.jsx";

/**
 * get options for dropdown or checkbox
 */
export function use_M_Option() {
    const metadata = use_M_Data();

    const getOptions = (M_Class_Name) => {
        if (!metadata?.m_data?.[M_Class_Name]) return [];
        return Object.keys(metadata.m_data[M_Class_Name]).sort();
    };

    return { getOptions };
}
