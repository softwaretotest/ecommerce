import "./LoadingView.css";
import { L } from "@/i18n";

function LoadingView({ loadingName }) {
    return (
        <div className="loading-container text-bg">
            <div className="spinner"></div>

            <h1 className="loading-text">
                {L.loading} {loadingName}...
            </h1>

            <h2>{L.please_wait}</h2>
        </div>
    );
}

export default LoadingView;
