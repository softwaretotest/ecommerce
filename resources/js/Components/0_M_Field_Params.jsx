// resources/js/Components/0_M_Field_Params.jsx

import { FIELD_PARAMS_MAP } from "@/Components/0_M_MAP";

export function Field_Params({ param_name, field_params }) {
    if (!field_params) return;
    const config = FIELD_PARAMS_MAP[param_name];
    return (
        <div className="field_params_container">
            <p className="field_param_header">{param_name} params</p>
            {config.map((item, index) => (
                /**
                 * * we must set key={index + param_name} to make uiniq DOM
                 * * otherwise we have problem when user switch Dropdown D like this e.g.
                 * * between [DECIMAL,10,2] and [STRING,255]
                 * *  switch the 10 <----> 255   ,
                 * *DECIMAL item[0] <----> item[0] STRING
                 **/
                <div key={index + param_name} className="fied_param_body">
                    <label className="field_param_label">{item.label}:</label>
                    <input
                        type="text"
                        defaultValue={field_params[index]}
                        className="field_param_input"
                    />
                </div>
            ))}
        </div>
    );
}
