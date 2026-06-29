import { use_M_Data } from "@/Providers/0_M_DataProvider.jsx";

/**
 * get options for dropdown or checkbox
 */
export function use_M_Option() {
    const metadata = use_M_Data();

    const getOptions = (M_Class_Name) => {
        const data =
            M_Class_Name === "entities" ? metadata.app_data : metadata.m_data;
        if (!data?.[M_Class_Name]) return [];
        return Object.keys(data[M_Class_Name]).sort();
    };

    return { getOptions };
}
