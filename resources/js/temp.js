/**
 * 1. get fieldname from M_value
 * 2. find d_Class e.g. d::DECIMAL
 * 3. get d_params from UI Input
 * 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
 *
 * @param {*} activeField = e.g. IMAGE , NAME , PRICE , STOCK
 * @param {*} M_value
 * @returns D_Array e.g. ['d::DECIMAL', 10, 2] or ['d::STRING', 255]
 */
// export function get_D_Array(event, activeField, M_value) {
//     if (debug) console.log("get_D_Array 1. fieldname event = ", event);
//     if (debug)
//         console.log("get_D_Array 1. fieldname activeField = ", activeField);
//     if (debug) console.log("get_D_Array 1. fieldname M_value = ", M_value);

//     // 1. get fieldname from M_value
//     const fieldname = Object.keys(M_value).find(
//         (key) => key.toLowerCase() === activeField.toLowerCase(),
//     );
//     if (debug) console.log("get_D_Array 2. fieldname = ", fieldname);

//     const field_data = M_value[fieldname];
//     if (!field_data) return;
//     // if(debug) console.log("get_D_Array 3. field_data = ", field_data);

//     /**
//      * *  find d_Class_UPPERCASE_Array
//      * *  self healing of wrong d_Class_UPPERCASE_Array
//      * 2. find d_Class e.g. ['d::DECIMAL',10,2]
//      * * if wrong 'd::DECIMAL'
//      * * then make it right ['d::DECIMAL',10,2]
//      * * save_M_value_Data_for_self_healing_d_Class
//      */
//     const d_Class_UPPERCASE_Array = (() => {
//         /**
//          * e.g. ['d::STRING',255]
//          */
//         const d_Class_Item = field_data.find((item) => {
//             const target = Array.isArray(item) ? item[0] : item;
//             return typeof target === "string" && target.startsWith("d::");
//         });
//         if (Array.isArray(d_Class_Item)) return d_Class_Item;

//         // d_Class_Item is a string
//         const d_Name_UPPERCASE = d_Class_Item.replace("d::", "");

//         const config = D_PARAMS_MAP[d_Name_UPPERCASE];

//         // if not in config, then d_Class_Item meant to be string
//         if (!config) return d_Class_Item; //e.g. 'd::BOOLEAN' , 'd::INTEGER'

//         const d_Array = [
//             // if 'd::STRING' = wrong , must be Array made by D_PARAMS_MAP
//             `d::${d_Name_UPPERCASE}`,
//             ...D_PARAMS_MAP[d_Name_UPPERCASE].map((p) => p.default),
//         ]; // return e.g. ['d::STRING',255]

//         return d_Array;
//     })();

//     if (debug)
//         console.log(
//             "get_D_Array 4. d_Class_UPPERCASE_Array = ",
//             d_Class_UPPERCASE_Array,
//         );
//     if (debug)
//         console.log(
//             "get_D_Array 5. d_Class_UPPERCASE_Array[0] = ",
//             d_Class_UPPERCASE_Array[0],
//         );

//     if (!d_Class_UPPERCASE_Array) return;

//     // 3. get d_params from UI Input
//     const container = event.target.closest(".d_params_container");

//     if (!container) {
//         console.error(`NOT FOUND container of field : ${activeField}`);
//         return;
//     }
//     // if(debug) console.log("get_D_Array 6. container = ", container);
//     const inputs = container.querySelectorAll(".d_param_input");
//     const params_values = Array.from(inputs).map((input) =>
//         Number(input.value),
//     );

//     // 4. get D_Array e.g. ['d::DECIMAL', 10, 2]
//     // d_Class_UPPERCASE_Array[0], because only 1 d:: per field (M_Convention)
//     const D_Array = [`${d_Class_UPPERCASE_Array[0]}`, ...params_values];
//     if (debug) console.log("get_D_Array 7. D_Array = ", D_Array);
//     if (debug) console.log("get_D_Array --- [DEBUG: END] ---");

//     return D_Array;
// }
