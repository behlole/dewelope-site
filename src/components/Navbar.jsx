import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FiArrowUpRight} from "react-icons/fi";
import {profile} from "../constants/index.js";
import {cn} from "../utils/cn.js";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
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
                <a
                    href="#hero"
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
                        <span className="text-[10px] text-muted font-mono uppercase tracking-[0.3em] mt-0.5">
                            {profile.role}
                        </span>
                    </div>
                </a>

                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm btn-magnetic"
                >
                    Start a project
                    <FiArrowUpRight className="text-base"/>
                </a>
            </div>
        </motion.nav>
    );
};

export default Navbar;
