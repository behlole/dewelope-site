import React, {useEffect, useState} from "react";
import {motion, useReducedMotion} from "framer-motion";
import {FiArrowDown, FiArrowUpRight, FiMail} from "react-icons/fi";
import {heroStats, profile} from "../constants/index.js";

const word = (reduce) => ({
    hidden: {y: reduce ? 0 : "120%", opacity: reduce ? 1 : 0},
    show: (i) => ({
        y: "0%",
        opacity: 1,
        transition: {
            duration: reduce ? 0 : 0.9,
            delay: reduce ? 0 : 0.1 + i * 0.06,
            ease: [0.2, 0.8, 0.2, 1],
        },
    }),
});

const Word = ({children, i, className = "", variants}) => (
    <span className="inline-block overflow-hidden align-bottom mr-2 sm:mr-3 lg:mr-5">
        <motion.span
            custom={i}
            variants={variants}
            initial="hidden"
            animate="show"
            className={`inline-block ${className}`}
        >
            {children}
        </motion.span>
    </span>
);

// Blinking terminal caret
const Caret = () => (
    <span className="inline-block w-[7px] h-[14px] ml-1 bg-accent-3 align-middle animate-pulse"/>
);

// Corner HUD bracket
const Bracket = ({position}) => {
    const map = {
        tl: "top-0 left-0 border-l border-t",
        tr: "top-0 right-0 border-r border-t",
        bl: "bottom-0 left-0 border-l border-b",
        br: "bottom-0 right-0 border-r border-b",
    };
    return (
        <span
            className={`pointer-events-none absolute ${map[position]} w-5 h-5 border-accent-2/60`}
            aria-hidden
        />
    );
};

// Small system-info panel
const SysPanel = () => {
    const [time, setTime] = useState("");
    useEffect(() => {
        const update = () => {
            const d = new Date();
            setTime(d.toISOString().replace("T", " ").slice(0, 19) + "Z");
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="glass rounded-lg px-3 py-2 text-[10px] font-mono text-white/80 leading-relaxed min-w-[210px]">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse"/>
                <span className="text-accent-3 uppercase tracking-widest text-[9px]">system · online</span>
            </div>
            <div className="text-muted">&gt; node: <span className="text-white">dewelope-core-01</span></div>
            <div className="text-muted">&gt; uptime: <span className="text-white">99.99%</span></div>
            <div className="text-muted">&gt; time: <span className="text-white">{time}</span></div>
        </div>
    );
};

const Hero = () => {
    const reduce = useReducedMotion();
    const v = word(reduce);

    // Mouse coordinate readout (updated directly on the DOM node to avoid re-renders)
    const [coord, setCoord] = useState({x: 0, y: 0});
    useEffect(() => {
        const onMove = (e) => setCoord({x: e.clientX, y: e.clientY});
        window.addEventListener("pointermove", onMove, {passive: true});
        return () => window.removeEventListener("pointermove", onMove);
    }, []);

    return (
        <section
            id="hero"
            className="relative w-full min-h-[100svh] overflow-hidden flex flex-col"
        >
            {/* Grid backdrop (the 3D scene lives behind App, not here) */}
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]"/>

            {/* Subtle horizontal scan lines (CRT feel) */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
                }}
                aria-hidden
            />

            {/* HUD corner brackets around the hero */}
            <div className="pointer-events-none absolute inset-6 sm:inset-10">
                <Bracket position="tl"/>
                <Bracket position="tr"/>
                <Bracket position="bl"/>
                <Bracket position="br"/>
            </div>

            {/* Top-right sys panel */}
            <div className="pointer-events-none absolute top-24 sm:top-28 right-6 sm:right-10 z-20 hidden md:block">
                <SysPanel/>
            </div>

            {/* Left-side vertical callout */}
            <div className="pointer-events-none absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-6 text-[10px] font-mono uppercase tracking-[0.4em] text-muted">
                <span className="[writing-mode:vertical-rl] rotate-180">dewelope / v1.0 / rawalpindi · pk</span>
            </div>

            {/* Bottom-left mouse coords */}
            <div className="pointer-events-none absolute bottom-[168px] sm:bottom-[180px] left-6 sm:left-10 z-20 hidden md:block text-[10px] font-mono text-muted">
                <span className="text-accent-2">mouse</span> :: x={String(coord.x).padStart(4, "0")} y={String(coord.y).padStart(4, "0")}
            </div>

            {/* Center column */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pt-28 sm:pt-32 lg:pt-36 pb-16 max-w-6xl mx-auto w-full">
                {/* Terminal-style eyebrow */}
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.05, duration: 0.6}}
                    className="inline-flex items-center gap-2 glass rounded-md pl-3 pr-3 py-1.5 mb-8 font-mono text-[11px] sm:text-xs"
                >
                    <span className="text-accent-3">$</span>
                    <span className="text-white/80">dewelope --status</span>
                    <span className="text-white/60">:</span>
                    <span className="text-accent-2">open-to-engagements</span>
                    <Caret/>
                </motion.div>

                <h1 className="font-display font-bold text-white text-center tracking-tight leading-[1.02] text-[44px] xs:text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px]">
                    <Word i={0} variants={v}>We ship</Word>
                    <Word i={1} variants={v} className="text-white/90">modern</Word>
                    <br className="hidden xs:block"/>
                    <Word i={2} variants={v} className="text-gradient-accent">software</Word>
                    <Word i={3} variants={v}>at</Word>
                    <br className="hidden xs:block"/>
                    <Word i={4} variants={v} className="text-gradient-warm">banking scale.</Word>
                </h1>

                {/* Tech-flavored tagline as 'console output' */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: reduce ? 0 : 0.75, duration: 0.7}}
                    className="mt-8 sm:mt-10 max-w-2xl w-full"
                >
                    <div className="font-mono text-[11px] sm:text-xs text-accent-2 tracking-widest uppercase mb-3 flex items-center gap-2 justify-center">
                        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-accent-2/50"/>
                        <span>// mission brief</span>
                        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-accent-2/50"/>
                    </div>
                    <p className="text-center text-[15px] sm:text-[17px] lg:text-[19px] text-secondary leading-relaxed">
                        {profile.tagline}
                    </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: reduce ? 0 : 0.9, duration: 0.7}}
                    className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                >
                    <a href="#contact"
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-primary font-semibold text-sm sm:text-base">
                        <span className="font-mono text-xs text-primary/60">&gt;</span>
                        Start a project
                        <FiArrowUpRight/>
                    </a>
                    <a href="#work"
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors font-mono">
                        <span className="text-accent-3">&gt;</span>
                        <span className="font-sans">See our work</span>
                        <FiArrowDown className="rotate-[-45deg]"/>
                    </a>
                    <a href={`mailto:${profile.email}`}
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors">
                        <FiMail/>
                        {profile.email}
                    </a>
                </motion.div>
            </div>

            {/* Stats strip — techy HUD styling */}
            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: reduce ? 0 : 1.1, duration: 0.8}}
                className="relative z-10 border-y border-accent-2/20 bg-primary/50 backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-7 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                    {heroStats.map((s, i) => (
                        <div key={s.label} className="flex items-start gap-3">
                            <span className="font-mono text-xs text-accent-2 mt-1.5 opacity-70">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="flex flex-col">
                                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none">
                                    {s.value}
                                </div>
                                <div className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-mono text-muted">
                                    {s.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
