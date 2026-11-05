import React from "react";
import "./Header.css";

export default function Header({ config, ButtonSetting }) {
    const title = config?.title ?? null;

    const centerItems = config?.actions
        ? React.Children.toArray(config.actions).flatMap((child) =>
              child?.props?.children ? child.props.children : child,
          )
        : [];

    return (
        <>
            {/* LEFT ZONE - Title */}
            {title}

            {/* CENTER ZONE - Actions */}
            <div className="header-content">
                {centerItems.map((child, i) => (
                    <React.Fragment key={i}>{child}</React.Fragment>
                ))}
            </div>

            {/* RIGHT ZONE - Settings Group */}
            <div className="setting">{ButtonSetting}</div>
        </>
    );
}
