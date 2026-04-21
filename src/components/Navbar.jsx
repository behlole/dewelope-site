import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {HiMenu, HiX} from "react-icons/hi";
import {FiArrowUpRight} from "react-icons/fi";
import {navLinks, profile} from "../constants/index.js";
import {cn} from "../utils/cn.js";

const Navbar = () => {
    const [active, setActive] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // active-section spy via IntersectionObserver
        const sections = navLinks
            .map((l) => document.getElementById(l.id))
            .filter(Boolean);
        if (!sections.length) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            {rootMargin: "-40% 0px -55% 0px", threshold: 0}
        );
        sections.forEach((s) => obs.observe(s));
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <motion.nav
                initial={{y: -40, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.6, ease: [0.2, 0.8, 0.2, 1]}}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled
                        ? "py-3 bg-primary/70 backdrop-blur-xl border-b border-white/5"
                        : "py-5 bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={() => setActive("")}
                        className="flex items-center gap-3 group"
                        aria-label="Dewelope — home"
                    >
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-glow">
                            <img src="/logo.svg" alt="" width="40" height="40" className="w-10 h-10"/>
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-accent-2 blur-lg opacity-40 group-hover:opacity-70 transition-opacity -z-10"/>
                        </div>
                        <div className="hidden sm:flex flex-col leading-tight">
                            <span className="font-display font-semibold text-[20px] tracking-tight leading-none">
                                <span className="text-white">de</span><span className="text-gradient-accent">we</span><span className="text-white">lope</span>
                            </span>
                            <span className="text-[10px] text-muted font-mono uppercase tracking-[0.3em] mt-0.5">{profile.role}</span>
                        </div>
                    </a>

                    {/* Center pill nav */}
                    <ul className="hidden md:flex items-center gap-1 glass rounded-full p-1.5">
                        {navLinks.map((link) => {
                            const isActive = active === link.id;
                            return (
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        className={cn(
                                            "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                            isActive ? "text-white" : "text-secondary hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
                                                transition={{type: "spring", stiffness: 380, damping: 30}}
                                            />
                                        )}
                                        <span className="relative z-10">{link.title}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* CTA */}
                    <a
                        href="#contact"
                        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm btn-magnetic"
                    >
                        Start a project
                        <FiArrowUpRight className="text-base"/>
                    </a>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden text-white text-2xl p-2"
                        aria-label="Toggle menu"
                    >
                        {open ? <HiX/> : <HiMenu/>}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 z-40 md:hidden bg-primary/90 backdrop-blur-xl"
                    >
                        <motion.ul
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 10, opacity: 0}}
                            transition={{delay: 0.1}}
                            className="flex flex-col items-center justify-center h-full gap-6"
                        >
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.id}
                                    initial={{x: -20, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    transition={{delay: 0.15 + i * 0.05}}
                                >
                                    <a
                                        href={`#${link.id}`}
                                        onClick={() => setOpen(false)}
                                        className="font-display text-4xl font-semibold text-white hover:text-gradient-accent transition-colors"
                                    >
                                        {link.title}
                                    </a>
                                </motion.li>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setOpen(false)}
                                className="mt-6 px-8 py-3 rounded-full bg-white text-primary font-semibold"
                            >
                                Start a project
                            </a>
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
