import React, {useEffect, useRef, useState} from "react";

/**
 * Mounts `children` only when the wrapper enters the viewport (with optional
 * pre-load `rootMargin`). Renders an invisible spacer with the same layout
 * footprint via `minHeight` so the page doesn't jump.
 *
 * Use for heavy sections (3D canvases, large media) below the fold.
 */
const LazyVisible = ({
                         children,
                         rootMargin = "300px 0px",
                         minHeight = "auto",
                         className = "",
                         once = true,
                     }) => {
    const ref = useRef(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        if (typeof IntersectionObserver === "undefined") {
            setShow(true);
            return;
        }
        const obs = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                if (e.isIntersecting) {
                    setShow(true);
                    if (once) obs.disconnect();
                } else if (!once) {
                    setShow(false);
                }
            },
            {rootMargin}
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [rootMargin, once]);

    return (
        <div ref={ref} className={className} style={{minHeight: show ? undefined : minHeight}}>
            {show ? children : null}
        </div>
    );
};

export default LazyVisible;
