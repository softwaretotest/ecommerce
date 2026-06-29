import { useEffect } from "react";

/**
 * listen to activeField and auto. Scroll
 */
export const useScrollIntoView = (activeField, scrollRefs) => {
    useEffect(() => {
        const element = scrollRefs.current[activeField];
        if (activeField && element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [activeField, scrollRefs]);
};
