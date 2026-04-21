import React, {useEffect, useRef, useState} from "react";

const INTERACTIVE = 'a, button, [data-magnet], [role="button"], input, textarea, label, [data-cursor="hover"]';

const Cursor = () => {
    const dotRef = useRef(null);
    const haloRef = useRef(null);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        setSupported(mq.matches);
        const onChange = (e) => setSupported(e.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    useEffect(() => {
        if (!supported) return;
        document.documentElement.classList.add("has-custom-cursor");
        return () => document.documentElement.classList.remove("has-custom-cursor");
    }, [supported]);

    useEffect(() => {
        if (!supported) return;
        const dot = dotRef.current;
        const halo = haloRef.current;
        if (!dot || !halo) return;

        const target = {x: window.innerWidth / 2, y: window.innerHeight / 2};
        const dotPos = {x: target.x, y: target.y};
        const haloPos = {x: target.x, y: target.y};
        const state = {hovering: false, pressed: false};

        const onMove = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };
        const onDown = () => { state.pressed = true; };
        const onUp = () => { state.pressed = false; };
        const onLeave = () => {
            dot.style.opacity = "0";
            halo.style.opacity = "0";
        };
        const onEnter = () => {
            dot.style.opacity = "1";
            halo.style.opacity = "1";
        };

        const onOver = (e) => {
            if (e.target.closest && e.target.closest(INTERACTIVE)) state.hovering = true;
        };
        const onOut = (e) => {
            const leaving = e.target.closest && e.target.closest(INTERACTIVE);
            const entering = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(INTERACTIVE);
            if (leaving && !entering) state.hovering = false;
        };

        window.addEventListener("pointermove", onMove, {passive: true});
        window.addEventListener("pointerdown", onDown, {passive: true});
        window.addEventListener("pointerup", onUp, {passive: true});
        window.addEventListener("pointerleave", onLeave);
        window.addEventListener("pointerenter", onEnter);
        document.addEventListener("pointerover", onOver, {passive: true});
        document.addEventListener("pointerout", onOut, {passive: true});

        let raf = 0;
        const loop = () => {
            dotPos.x += (target.x - dotPos.x) * 0.35;
            dotPos.y += (target.y - dotPos.y) * 0.35;
            haloPos.x += (target.x - haloPos.x) * 0.14;
            haloPos.y += (target.y - haloPos.y) * 0.14;

            const haloScale = state.hovering ? (state.pressed ? 1.35 : 1.55) : (state.pressed ? 0.7 : 1);
            const dotScale = state.hovering ? 0.5 : (state.pressed ? 0.7 : 1);

            dot.style.transform =
                `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
            halo.style.transform =
                `translate3d(${haloPos.x}px, ${haloPos.y}px, 0) translate(-50%, -50%) scale(${haloScale})`;
            halo.style.borderColor = state.hovering ? "rgba(34, 211, 238, 0.9)" : "rgba(124, 92, 255, 0.45)";

            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("pointerenter", onEnter);
            document.removeEventListener("pointerover", onOver);
            document.removeEventListener("pointerout", onOut);
        };
    }, [supported]);

    if (!supported) return null;

    return (
        <>
            <div
                ref={haloRef}
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-accent/45 z-[9999] mix-blend-difference transition-[border-color] duration-200"
                style={{willChange: "transform"}}
            />
            <div
                ref={dotRef}
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-accent-2 z-[9999] mix-blend-difference"
                style={{willChange: "transform"}}
            />
        </>
    );
};

export default Cursor;
