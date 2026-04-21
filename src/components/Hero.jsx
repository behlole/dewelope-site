import React from "react";
import {motion, useReducedMotion} from "framer-motion";
import {FiArrowDown, FiDownload, FiGithub, FiLinkedin, FiMail} from "react-icons/fi";
import {styles} from "../style.js";
import {CrystalCanvas} from "./canvas/index.js";
import {heroStats, profile} from "../constants/index.js";

const word = (reduce) => ({
    hidden: {y: reduce ? 0 : "120%", opacity: reduce ? 1 : 0},
    show: (i) => ({
        y: "0%",
        opacity: 1,
        transition: {
            duration: reduce ? 0 : 0.9,
            delay: reduce ? 0 : 0.15 + i * 0.08,
            ease: [0.2, 0.8, 0.2, 1],
        },
    }),
});

const Word = ({children, i, className = "", variants}) => (
    <span className="inline-block overflow-hidden align-bottom mr-2 sm:mr-3">
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
            className="relative w-full min-h-[100svh] overflow-hidden bg-hero-pattern"
        >
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"/>
            <div className="pointer-events-none absolute inset-0 bg-radial-glow"/>

            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-28 sm:pt-32 lg:pt-40 pb-20 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left: copy */}
                <div className="lg:col-span-7 z-10 order-2 lg:order-1">
                    <motion.div
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.05, duration: 0.6}}
                        className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-3 sm:pr-4 py-1.5 mb-6 sm:mb-7 max-w-full"
                    >
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-3 opacity-75"/>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-3"/>
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-secondary truncate">
                            {profile.availability}
                        </span>
                    </motion.div>

                    <h1 className={styles.heroHeadText}>
                        <Word i={0} variants={v}>We ship</Word>
                        <Word i={1} variants={v} className="text-white/90">modern</Word>
                        <Word i={2} variants={v}>platforms</Word>
                        <br className="hidden sm:block"/>
                        <Word i={3} variants={v}>at</Word>
                        <Word i={4} variants={v} className="text-gradient-accent">banking</Word>
                        <Word i={5} variants={v} className="text-gradient-warm">scale.</Word>
                    </h1>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: reduce ? 0 : 1.05, duration: 0.7}}
                        className={`${styles.heroSubText} mt-6 sm:mt-7 max-w-xl`}
                    >
                        {profile.tagline}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: reduce ? 0 : 1.2, duration: 0.7}}
                        className="mt-8 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
                    >
                        <a href="#work"
                           className="btn-magnetic inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-white text-primary font-semibold text-sm sm:text-base">
                            See our work
                            <FiArrowDown className="rotate-[-45deg]"/>
                        </a>
                        <a href="#contact"
                           className="btn-magnetic inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors">
                            <FiMail/>
                            Start a project
                        </a>
                        {profile.resumeUrl && profile.resumeUrl !== "#" && (
                            <a href={profile.resumeUrl} target="_blank" rel="noreferrer"
                               className="btn-magnetic inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full glass text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-colors">
                                <FiDownload/>
                                Resume
                            </a>
                        )}

                        <div className="flex items-center gap-2 sm:gap-3 sm:ml-2">
                            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"
                               className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                                <FiGithub/>
                            </a>
                            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                               className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                                <FiLinkedin/>
                            </a>
                            <a href={`mailto:${profile.email}`} aria-label="Email"
                               className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                                <FiMail/>
                            </a>
                        </div>
                    </motion.div>

                    {/* stats */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: reduce ? 0 : 1.35, duration: 0.7}}
                        className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 sm:gap-x-10 gap-y-5"
                    >
                        {heroStats.map((s) => (
                            <div key={s.label}>
                                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                                <div className="text-[10px] sm:text-xs uppercase tracking-wider font-mono text-muted mt-0.5">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: 3D crystal */}
                <div className="lg:col-span-5 relative h-[320px] sm:h-[440px] lg:h-[600px] order-1 lg:order-2">
                    <div className="absolute inset-0">
                        <CrystalCanvas/>
                    </div>
                    <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-muted hidden sm:block">
                        ◉ live · idle
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-widest text-muted hidden sm:block">
                        v2.0 · {profile.location}
                    </div>
                </div>
            </div>

            <a
                href="#services"
                aria-label="Scroll to services"
                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted hover:text-white transition-colors"
            >
                <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Scroll</span>
                <div className="w-[26px] h-[44px] rounded-full border border-white/20 flex justify-center items-start p-1.5">
                    <motion.div
                        animate={reduce ? {} : {y: [0, 14, 0]}}
                        transition={{duration: 1.6, repeat: Infinity, ease: "easeInOut"}}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-accent to-accent-2"
                    />
                </div>
            </a>
        </section>
    );
};

export default Hero;
