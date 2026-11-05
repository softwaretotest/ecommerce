import { useEffect } from "react";

/**
 * Global registry of all Escape key handlers
 * Each component using useKeyEscape will register itself here
 */
const handlers = new Set();

/**
 * Currently active handler (top-most / last mounted layer)
 * This ensures only the active UI layer responds to ESC
 */
let activeHandler = null;

/**
 * Global Escape key listener
 * Runs once for the entire application lifecycle
 */
const handleKey = (e) => {
    if (e.key !== "Escape") return;

    /**
     * Sort handlers by priority (higher priority first)
     * This acts as a fallback system if activeHandler is missing
     */
    const sortedHandlers = [...handlers].sort(
        (a, b) => b.priority - a.priority,
    );

    /**
     * Prefer active handler (top-most UI layer)
     * Fallback to highest priority handler if active is not available
     */
    const handler = activeHandler || sortedHandlers[0];

    if (!handler) return;

    /**
     * Execute Escape handler for the active layer
     */
    const result = handler.callback();

    /**
     * Optional control:
     * If callback returns false, allow future fallback logic
     */
    if (result === false) {
        return;
    }
};

/**
 * Register global key listener once
 * This ensures ESC is handled at application level
 */
window.addEventListener("keydown", handleKey);

/**
 * Hook: useKeyEscape
 *
 * Registers a component as an ESC target
 *
 * @param {Function} callback - function to execute on ESC
 * @param {boolean} enabled - enable/disable ESC handling
 * @param {number} priority - fallback priority when activeHandler is missing
 */
export default function useKeyEscape(callback, enabled = true, priority = 0) {
    useEffect(() => {
        if (!enabled) return;

        /**
         * Create handler object for this component instance
         */
        const handler = {
            callback,
            priority,
        };

        /**
         * Register handler into global ESC registry
         */
        handlers.add(handler);

        /**
         * Mark this handler as the active (top-most) layer
         * This ensures ESC only closes the currently focused UI layer
         */
        activeHandler = handler;

        return () => {
            /**
             * Remove handler when component unmounts or disables ESC
             */
            handlers.delete(handler);

            /**
             * Clean up active reference if this was the active layer
             */
            if (activeHandler === handler) {
                activeHandler = null;
            }
        };
    }, [callback, enabled, priority]);
}
