// \resources\js\Components\0_M_Option.jsx
import { use_M_Option } from "@/Hooks/use_M_Option.js";

/**
 * Prepare options for Dropdown D , U , T
 * @param {*} M_Class_Name_List
 * * M_Class_Name_List: e.g. ['d']
 * @param {*} field_data 
  * * field_data: e.g. ['confirm_order', 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', false]

 * @returns options for select of e.g. U , D , T (of ENTITIES)
 */
export function M_Option({ M_Class_Name_List, field_data }) {
    /**
     * * fieldname = e.g. image , name , price
     * * fieldDataList = e.g.
     * * [ 'd::BOOLEAN', 'u::SELECT', ['cd::DEFAULT', false]
     */
    const [fieldname, ...fieldDataList] = field_data;

    const { getOptions } = use_M_Option();
    if (!M_Class_Name_List) return null;
    return M_Class_Name_List.flatMap((M_Class_Name) => {
        const options = getOptions(M_Class_Name);

        return options.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));
    });
}
