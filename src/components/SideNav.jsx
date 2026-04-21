import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {cn} from "../utils/cn.js";

const SECTIONS = [
    {id: "hero",     label: "Home"},
    {id: "services", label: "Services"},
    {id: "work",     label: "Work"},
    {id: "process",  label: "Process"},
    {id: "stack",    label: "Stack"},
    {id: "voices",   label: "Voices"},
    {id: "contact",  label: "Contact"},
];

const SideNav = () => {
    const [active, setActive] = useState("hero");
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        const targets = SECTIONS
            .map((s) => ({id: s.id, el: document.getElementById(s.id)}))
            .filter((x) => x.el);
        if (!targets.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            {rootMargin: "-40% 0px -55% 0px", threshold: 0}
        );
        targets.forEach(({el}) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const go = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
    };

    return (
        <motion.nav
            aria-label="Section navigation"
            initial={{opacity: 0, x: 10}}
            animate={{opacity: 1, x: 0}}
            transition={{delay: 0.6, duration: 0.6, ease: [0.2, 0.8, 0.2, 1]}}
            className="fixed right-5 sm:right-7 top-1/2 -translate-y-1/2 z-[45] hidden md:flex flex-col gap-3"
        >
            {SECTIONS.map((s) => {
                const isActive = active === s.id;
                const isHovered = hovered === s.id;
                return (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => go(s.id)}
                        onMouseEnter={() => setHovered(s.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(s.id)}
                        onBlur={() => setHovered(null)}
                        aria-label={`Jump to ${s.label}`}
                        aria-current={isActive ? "true" : undefined}
                        className="relative group flex items-center justify-end gap-3 pr-0"
                    >
                        <span
                            className={cn(
                                "font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-all duration-300",
                                isHovered || isActive
                                    ? "opacity-100 translate-x-0 text-white"
                                    : "opacity-0 translate-x-2 text-white/60"
                            )}
                        >
                            {s.label}
                        </span>
                        <span
                            className={cn(
                                "relative block rounded-full transition-all duration-300",
                                isActive
                                    ? "w-2.5 h-2.5 bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_12px_rgba(124,92,255,0.8)]"
                                    : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/80"
                            )}
                        />
                    </button>
                );
            })}
        </motion.nav>
    );
};

export default SideNav;
