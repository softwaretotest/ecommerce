import { useRef } from "react";

import { use_M_Store } from "@/Stores/0_M_Store";

import { useScrollIntoView } from "@/hooks/useScrollIntoView";

export default function Sidebar() {
    const M_value = use_M_Store((state) => state.M_value);

    const activeTab = use_M_Store.getState().activeTab;
    const activeSubTab = use_M_Store.getState().activeSubTab;
    const is_ENTITIES = activeTab === "entities" && activeSubTab === "entities";

    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store.getState().setActiveField;

    const selected_F_S = use_M_Store((state) => state.selected_F_S);

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    /**
     * Ref for drag item
     */
    const draggedItemIndex = useRef(null);

    /**
     * function on Start dragging
     * @param {*} index
     */
    const handleDragStart = (index) => {
        draggedItemIndex.current = index;
    };

    /**
     * * prevent default of dragover
     * * to except drop
     * @param {*} event
     */
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    /**
     * 1. Re-order selected_F_S on Drop
     * 2. save new sorted Entities to backend , after drop
     * @param {*} targetIndex
     * @returns
     */
    const handleDrop = (targetIndex) => {
        const sourceIndex = draggedItemIndex.current;
        if (sourceIndex === targetIndex) return;

        // get Key from selected_F_S
        const currentKeys = Object.keys(selected_F_S);

        const [movedItem] = currentKeys.splice(sourceIndex, 1);
        currentKeys.splice(targetIndex, 0, movedItem);

        // re-order sidebar buttons , USERS always at the top
        use_M_Store.getState().reorder_selected_F_S(currentKeys);

        draggedItemIndex.current = null;

        //TODO: Logic 2. save new sorted Entities to backend , after drop
    };

    let M_value_for_Loop = {};
    if (is_ENTITIES) {
        M_value_for_Loop = selected_F_S;
    } else {
        M_value_for_Loop = M_value;
    }

    return (
        <nav className="field-sidebar">
            {Object.keys(M_value_for_Loop).map((M_value_KEY, index) => (
                <button
                    key={M_value_KEY.toLowerCase()}
                    ref={(DOM_Node) =>
                        (scrollRefs.current[M_value_KEY.toLowerCase()] =
                            DOM_Node)
                    }
                    className={`field-nav-link ${activeField === M_value_KEY.toLowerCase() ? "active" : ""}`}
                    // --------  Drag and Drop  ----------
                    draggable={
                        activeTab === "entities" && activeSubTab === "entities"
                    }
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    // ------------------------------------

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
