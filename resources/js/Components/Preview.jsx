import { withEscView } from "@/hooks/hoc.withEscView";

function Preview({ item, onClose }) {
    return (
        <div className="preview-overlay" onClick={onClose}>
            <button className="btn-preview-close" onClick={onClose}>
                ✕
            </button>
            <img src={item} alt="preview" />
        </div>
    );
}

export default withEscView(Preview);
