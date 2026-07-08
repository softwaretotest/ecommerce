// resources/js/Components/0_M_Field_Params.jsx

import { FIELD_PARAMS_MAP } from "@/Components/0_M_MAP";

export function Field_Params({ param_name, field_params }) {
    const config = FIELD_PARAMS_MAP[param_name] || [];

    return (
        <div className="field_params_container">
            <p className="field_param_header">{param_name} params</p>
            {config.map((item, index) => (
                <div key={index} className="fied_param_body">
                    <label className="field_param_label">{item.label}:</label>
                    <input
                        type="text"
                        // ใช้ค่าจาก field_params (ถ้ามี) ถ้าไม่มีใช้ค่า default
                        defaultValue={field_params[index] ?? item.default}
                        className="field_param_input"
                    />
                </div>
            ))}
        </div>
    );
}
