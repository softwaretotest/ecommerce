import { useState, useEffect, useRef } from "react";
import svgCode from "../../../public/favicon.svg?raw";
import "./Dashboard.css";
import { L } from "@/i18n";

const SHAPES = "path, circle, rect, ellipse, line, polygon, polyline";

/**
 * This is only test to make svg interactive with react
 * @returns
 */
export default function Dashboard() {
    const boxRef = useRef(null); // referenc of SVG
    const [selected, setSelected] = useState(null); // id of clicked item on logo
    const [data, setData] = useState(null); // data from Laravel

    // get data from laravel only once
    useEffect(() => {
        fetch("/dashboard-data")
            .then((res) => (res.ok ? res.json() : null))
            .then(setData)
            .catch(() => setData(null));
    }, []);

    // if selected changed: put class is-active on selected item
    useEffect(() => {
        const box = boxRef.current;
        box.querySelectorAll(".is-active").forEach((el) =>
            el.classList.remove("is-active"),
        );
        if (selected) {
            box.querySelector(`#${CSS.escape(selected)}`)?.classList.add(
                "is-active",
            );
        }
    }, [selected]);

    // findout which part of the logo was clicked
    function handleClick(e) {
        const shape = e.target.closest(SHAPES);
        setSelected(shape?.id || null);
    }

    /**
     * ```text
     * fix favicon <svg> tag
     * from
     * <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none">
     * to
     * <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     * @param {*} raw
     * @returns
     */
    function fixSvg(raw) {
        const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
        const svg = doc.documentElement;

        // if on viewBox , then make svg from width/height (e.g. 24 x 24 → "0 0 24 24")
        const w = parseFloat(svg.getAttribute("width")) || 24;
        const h = parseFloat(svg.getAttribute("height")) || 24;
        if (!svg.hasAttribute("viewBox")) {
            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        }

        // delete fix size and let CSS manage size of svg
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        // if no fill , then fill="none"
        if (!svg.hasAttribute("fill")) {
            svg.setAttribute("fill", "none");
        }

        return new XMLSerializer().serializeToString(svg);
    }

    const svgHtml = fixSvg(svgCode);

    return (
        <div className="logo-screen">
            <div
                ref={boxRef}
                className="logo-box"
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: svgHtml }}
            />

            {selected && (
                <div className="info-panel">
                    <p>
                        คลิกชิ้น: <b>{selected}</b>
                    </p>
                    {data && (
                        <p>
                            {L.sale_volumne}: {data.sales}
                        </p>
                    )}
                    <button onClick={() => setSelected(null)}>{L.close}</button>
                </div>
            )}
        </div>
    );
}
