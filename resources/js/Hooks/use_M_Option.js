import { use_M_Data } from "@/Services/0_M_DataProvider.jsx";

/**
 * get options for dropdown or checkbox
 */
export function use_M_Option() {
    const metadata = use_M_Data();
    console.log("0_M_DataProvider.jsx - metadata = ", metadata);
    const getOptions = (M_Class_Name) => {
        if (!metadata?.app_data?.[M_Class_Name]) return [];
        return Object.keys(metadata.app_data[M_Class_Name]).sort();
    };

    return { getOptions };
}
