import useKeyEscape from "@/hooks/useKeyEscape";

/**
 * Higher-Order Component (HOC)
 *
 * Adds Escape key close behavior to any wrapped component.
 *
 * This HOC is reusable across:
 * - modal components
 * - preview overlays
 * - full-screen views
 *
 * It does NOT assume UI type (modal/image/etc),
 * only behavior: "ESC triggers onClose".
 *
 * @param {React.ComponentType<any>} WrappedComponent
 * A React component that will receive all original props
 * and be enhanced with ESC-to-close behavior.
 *
 * @returns {React.ComponentType<any>}
 * A new component that wraps the original one and injects ESC behavior.
 */
export function withEscView(WrappedComponent) {
    return function Wrapped(props) {
        const { onClose, escapeEnabled = true, escapePriority = 100 } = props;

        /**
         * ESC handler wrapper
         *
         * Purpose:
         * - Normalize close behavior from props
         * - Ensure ESC system always receives a boolean "consumed" signal
         *
         * @returns {boolean}
         * true  = ESC is consumed (stop propagation)
         * false = no action taken
         */
        const handleClose = () => {
            if (typeof onClose === "function") {
                onClose();
                return true; // ESC consumed
            }

            return false;
        };

        /**
         * Register ESC handler into global ESC manager
         */
        useKeyEscape(handleClose, escapeEnabled, escapePriority);

        return <WrappedComponent {...props} />;
    };
}
