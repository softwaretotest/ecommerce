// resources/js/Components/0_M_JSON_Content.jsx
import React, { useEffect, useRef } from "react";
import { use_M_Store } from "@/Stores/0_M_Store.jsx";

import { useScrollIntoView } from "@/hooks/useScrollIntoView";

export default function JSON_Content({ M_value, activeField, setActiveField }) {
    const setFocus = use_M_Store((state) => state.setFocus);

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

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
                        ref={(DOM_Node) =>
                            (scrollRefs.current[fieldname] = DOM_Node)
                        }
                        className={`json-line ${activeField === fieldname ? "json-highlight" : ""}`}
                        onClick={() => {
                            setFocus(fieldname, M_value);
                            setActiveField(fieldname);
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
