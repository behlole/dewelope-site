import {useEffect, useRef, useState} from "react";

const Cursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // disable on touch devices and on small screens (< md)
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(max-width: 767px)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setEnabled(true);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let raf;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
            }
        };

        const tick = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
            }
            raf = requestAnimationFrame(tick);
        };

        const onEnter = () => {
            ringRef.current?.classList.add("scale-150", "border-accent-2");
        };
        const onLeave = () => {
            ringRef.current?.classList.remove("scale-150", "border-accent-2");
        };

        window.addEventListener("mousemove", onMove);
        document.querySelectorAll("a, button, [data-cursor='hover']").forEach((el) => {
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
        });

        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    if (!enabled) return null;

    return (
        <>
            <div
                ref={dotRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
            />
            <div
                ref={ringRef}
                className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-white/40 transition-transform duration-200 ease-out mix-blend-difference"
            />
        </>
    );
};

export default Cursor;
