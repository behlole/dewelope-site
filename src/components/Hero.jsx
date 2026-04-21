import React from "react";
import {motion, useReducedMotion} from "framer-motion";
import {FiArrowDown, FiArrowUpRight, FiMail} from "react-icons/fi";
import {CrystalCanvas} from "./canvas/index.js";
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

const Hero = () => {
    const reduce = useReducedMotion();
    const v = word(reduce);

    return (
        <section
            id="hero"
            className="relative w-full min-h-[100svh] overflow-hidden bg-hero-pattern flex flex-col"
        >
            {/* Grid + glow backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]"/>
            <div className="pointer-events-none absolute inset-0 bg-radial-glow"/>

            {/* 3D scene as ambient backdrop — masked to fade out at edges */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.55] sm:opacity-60 [mask-image:radial-gradient(circle_at_center,black_35%,transparent_80%)]"
                aria-hidden
            >
                <CrystalCanvas/>
            </div>

            {/* Center column — takes the hero */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pt-28 sm:pt-32 lg:pt-36 pb-16 max-w-6xl mx-auto w-full">
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.05, duration: 0.6}}
                    className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 mb-8"
                >
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-3 opacity-75"/>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-3"/>
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-secondary">
                        {profile.availability}
                    </span>
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

                <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: reduce ? 0 : 0.75, duration: 0.7}}
                    className="mt-8 sm:mt-10 text-center text-[15px] sm:text-[17px] lg:text-[19px] text-secondary max-w-2xl leading-relaxed"
                >
                    {profile.tagline}
                </motion.p>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: reduce ? 0 : 0.9, duration: 0.7}}
                    className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                >
                    <a href="#contact"
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-primary font-semibold text-sm sm:text-base">
                        Start a project
                        <FiArrowUpRight/>
                    </a>
                    <a href="#work"
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors">
                        See our work
                        <FiArrowDown className="rotate-[-45deg]"/>
                    </a>
                    <a href={`mailto:${profile.email}`}
                       className="btn-magnetic inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors">
                        <FiMail/>
                        {profile.email}
                    </a>
                </motion.div>
            </div>

            {/* Stats strip — spans the bottom of hero */}
            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: reduce ? 0 : 1.1, duration: 0.8}}
                className="relative z-10 border-y border-white/5 bg-primary/40 backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-7 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                    {heroStats.map((s) => (
                        <div key={s.label} className="flex flex-col">
                            <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none">
                                {s.value}
                            </div>
                            <div className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-mono text-muted">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <a
                href="#services"
                aria-label="Scroll to services"
                className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted hover:text-white transition-colors"
            >
                <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Scroll</span>
                <div className="w-[24px] h-[40px] rounded-full border border-white/20 flex justify-center items-start p-1.5">
                    <motion.div
                        animate={reduce ? {} : {y: [0, 12, 0]}}
                        transition={{duration: 1.6, repeat: Infinity, ease: "easeInOut"}}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-accent to-accent-2"
                    />
                </div>
            </a>
        </section>
    );
};

export default Hero;
