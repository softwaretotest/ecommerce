import { useEffect, useState } from "react";
import "@/hooks/highlight/useHighlight.css";

/**
 * Focus user attention on a single entity card.
 *
 * Side effects:
 * - scroll into view
 * - temporarily lock page scroll
 * - apply highlight animation
 *
 * DO NOT:
 * - fetch data here
 * - mutate global state
 */

export default function useHighlight() {
    const [highlight, setHighlight] = useState(null);

    const triggerHighlight = (id, action) => {
        setHighlight({ id, action });
    };

    const clearHighlight = () => {
        setHighlight(null);
    };

    useEffect(() => {
        if (!highlight) return;

        /**
         * delay auto scroll for 200ms,
         * wait for DOM finish rendering first
         */
        const scrollTimer = setTimeout(() => {
            const el = document.getElementById(highlight.id);

            if (el) {
                el.scrollIntoView({
                    //auto scroll
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 200);

        const clearTimer = setTimeout(() => {
            setHighlight(null);
        }, 10000); // 10s for showing highlight

        return () => {
            clearTimeout(scrollTimer);
            clearTimeout(clearTimer);
        };
    }, [highlight]);

    return {
        highlight,
        triggerHighlight,
        clearHighlight, //for e.g. future, when new order still not processed, then stay new
    };
}
