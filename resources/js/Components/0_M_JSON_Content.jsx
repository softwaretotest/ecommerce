// resources/js/Components/0_M_JSON_Content.jsx
import React, { useEffect, useRef } from "react";

export default function JSON_Content({
    M_value,
    focusField,
    set_Focus_Siderbar_Button,
    setFocusField,
    setFocusJSON,
}) {
    const scrollRefs = useRef({});

    useEffect(() => {
        if (focusField && scrollRefs.current[focusField]) {
            scrollRefs.current[focusField].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [focusField]);

    /** renderArrayItem = e.g.
        "price",
        [
            "d::DECIMAL",
            10,
            2
        ]
     */
    const renderArrayItem = (value, depth = 0) => {
        if (Array.isArray(value)) {
            return (
                <div className="json-array">
                    [
                    {value.map((item, i) => (
                        <div
                            key={i}
                            className="json-item"
                            style={{ marginLeft: "20px" }}
                        >
                            {renderArrayItem(item, depth + 1)}
                            {i < value.length - 1 ? "," : ""}
                        </div>
                    ))}
                    ]
                </div>
            );
        }
        return <span className="json-primitive">{JSON.stringify(value)}</span>;
    };

    return (
        <div className="json-preview-container">
            <div className="json-list">
                {Object.entries(M_value).map(([fieldname, value]) => (
                    <div
                        key={fieldname} //fieldname = e.g. PRICE , STOCK etc.
                        ref={(el) => (scrollRefs.current[fieldname] = el)}
                        className={`json-line ${fieldname === focusField ? "json-highlight" : ""}`}
                        onClick={() => {
                            set_Focus_Siderbar_Button(fieldname);
                            setFocusField(fieldname);
                            setFocusJSON(fieldname);
                        }}
                    >
                        <span className="json-fieldname">"{fieldname}"</span>:{" "}
                        {renderArrayItem(value, 1)}
                    </div>
                ))}
            </div>
        </div>
    );
}
