// resources/js/Components/0_M_Field_Params.jsx

export function Field_Params({ param_name, field_params }) {
    const field_params_map = {
        DECIMAL: ["Total digits", "Scale"],
        STRING: ["Length"],
    };

    const labels = field_params_map[param_name] || [];

    return (
        <div className="field_params_container">
            <p className="field_param_header">{param_name} params</p>
            {field_params.map((param, index) => (
                <div key={index} className="fied_param_body">
                    {labels[index] && (
                        <label className="field_param_label">
                            {labels[index]}:
                        </label>
                    )}
                    <input
                        type="text"
                        defaultValue={param}
                        className="field_param_input"
                    />
                </div>
            ))}
        </div>
    );
}
