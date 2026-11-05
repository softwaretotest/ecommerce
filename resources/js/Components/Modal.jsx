import "./Modal.css";
import { withEscView } from "@/hooks/hoc.withEscView";
import useKeyEscape from "@/hooks/useKeyEscape";

function Modal({ children, onClose }) {
    useKeyEscape(onClose, Boolean(children), 100);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}
/**when open preview from modal-form
 * and user hit Esc , then only preview close first
 * hit Esc again , then modal-form close
 */
export default withEscView(Modal);
