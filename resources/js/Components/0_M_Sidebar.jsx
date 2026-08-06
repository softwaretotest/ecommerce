import { useRef } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { useScrollIntoView } from "@/hooks/useScrollIntoView";

export default function Sidebar() {
    const M_value = use_M_Store((state) => state.M_value);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store.getState().setActiveField;

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    return (
        <nav className="field-sidebar">
            {Object.keys(M_value).map((M_value_KEY) => (
                <button
                    key={M_value_KEY.toLowerCase()}
                    ref={(DOM_Node) =>
                        (scrollRefs.current[M_value_KEY.toLowerCase()] =
                            DOM_Node)
                    }
                    className={`field-nav-link ${activeField === M_value_KEY.toLowerCase() ? "active" : ""}`}
                    onClick={() => {
                        // M_value_KEY = null , when field deleted
                        if (M_value_KEY)
                            setActiveField(M_value_KEY.toLowerCase());
                    }}
                >
                    {/* if Class t (DB_Tablename) remove T:: */}
                    {M_value_KEY.toUpperCase().replaceAll("T::", "")}
                </button>
            ))}
        </nav>
    );
}
