import {useEffect} from "react";
import Lenis from "lenis";

const SmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.4,
        });

        let raf;
        const tick = (time) => {
            lenis.raf(time);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // anchor link integration
        const handleClick = (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            const id = link.getAttribute("href");
            if (id.length < 2) return;
            const el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            lenis.scrollTo(el, {offset: -80, duration: 1.4});
        };
        document.addEventListener("click", handleClick);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("click", handleClick);
            lenis.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
