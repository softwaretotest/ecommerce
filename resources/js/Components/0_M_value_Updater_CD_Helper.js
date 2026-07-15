// \resources\js\Components\0_M_value_Updater_CD_Helper.js
import { GLOBAL_METADATA } from "@/Providers/0_M_DataProvider";
import { get_D_NAME } from "@/Components/0_M_Data_Helper";
import { D_PARAMS_MAP, DEFAULT_VALUES_MAP } from "@/Components/0_M_MAP";

export function get_checked_cd_cud_names(
    checked_CD_States,
    field_data,
    cud_names,
    debug,
) {
    const fieldname_UPPERCASE = field_data[0].toUpperCase();
    return checked_CD_States.map((checked_cd_cud_name) => {
        const isCud = cud_names.some(
            (cd_name) =>
                cd_name.toLowerCase() === checked_cd_cud_name.toLowerCase(),
        );

        if (checked_cd_cud_name.toUpperCase() === "DEFAULT") {
            const defaultValue = DEFAULT_VALUES_from_M_value(
                fieldname_UPPERCASE,
                debug,
            );

            if (!defaultValue) {
                if (debug)
                    console.log(
                        `prepare_new_M_value_for_Update_CD - get_checked_cd_cud_names - 6.2 --- defaultValue NOT FOUND for ${checked_cd_cud_name} !!!!`,
                    );
            } else {
                if (debug)
                    console.log(
                        `prepare_new_M_value_for_Update_CD - get_checked_cd_cud_names - 6.2 - DEFAULT_VALUES_from_M_value(${fieldname_UPPERCASE}) = `,
                        DEFAULT_VALUES_from_M_value(fieldname_UPPERCASE, debug),
                        " --- defaultValue = ",
                        defaultValue,
                    );
                const prefix = isCud ? "cud" : "cd";
                return [`${prefix}::${checked_cd_cud_name}`, defaultValue];
            }
        }

        const config_for_D_PARAMS_MAP =
            D_PARAMS_MAP[checked_cd_cud_name.toUpperCase()];
        if (debug)
            console.log(
                "prepare_new_M_value_for_Update_CD - get_checked_cd_cud_names - 6.3 config_for_D_PARAMS_MAP = ",
                config_for_D_PARAMS_MAP,
            );

        if (!config_for_D_PARAMS_MAP) {
            return isCud
                ? `cud::${checked_cd_cud_name}`
                : `cd::${checked_cd_cud_name}`;
        }

        const d_Class_Name = get_D_NAME(field_data);

        const prefix = isCud ? "cud" : "cd";
        // first Array item of always config_for_D_PARAMS_MAP.map = typeof String
        const D_PARAMS_MAP_default_Value = config_for_D_PARAMS_MAP.map(
            (p) => p.default,
        )[0];

        // find if D_PARAMS_MAP.DEFAULT
        if (D_PARAMS_MAP_default_Value === "default_undefined") {
            const found_D_PARAMS_MAP_default_Value = [
                `${prefix}::${checked_cd_cud_name}`,
                DEFAULT_VALUES_MAP[d_Class_Name],
            ];
            if (debug) {
                console.log(
                    `prepare_new_M_value_for_Update_CD - get_checked_cd_cud_names - 6.4`,
                    found_D_PARAMS_MAP_default_Value,
                );
            }
            return found_D_PARAMS_MAP_default_Value;
        }

        // for other found D_PARAMS
        if (D_PARAMS_MAP_default_Value) {
            return [
                `${prefix}::${checked_cd_cud_name}`,
                ...config_for_D_PARAMS_MAP.map((p) => p.default),
            ];
        }
    });
}

/**
 * * find out the default value for d:: cd:: cud:: with params
 * * if params exists, d:: cd:: cud:: are array
 * * e.g. ['cd::DEFAULT', 0] , ['d::DECIMAL', 10, 10]
 * @param {*} fieldname_UPPERCASE
 * @returns
 */
function DEFAULT_VALUES_from_M_value(fieldname_UPPERCASE, debug) {
    const field_data = GLOBAL_METADATA.app_data.f[fieldname_UPPERCASE];

    /**
     * 'DECIMAL' of 'd::DECIMAL' ->
     */
    const D_NAME = get_D_NAME(field_data);
    if (debug)
        // console.log(
        //     "prepare_new_M_value_for_Update_CD - 6.2.2 - 0_M_value_Updater - DEFAULT_VALUES_from_M_value - D_NAME = ",
        //     D_NAME,
        // );

        // get from DEFAULT_VALUES_MAP matched D_NAME
        return DEFAULT_VALUES_MAP[D_NAME];
}
