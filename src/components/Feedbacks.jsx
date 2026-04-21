import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import {styles} from "../style.js";
import {testimonials} from "../constants/index.js";
import {textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";
import {cn} from "../utils/cn.js";

const CARD_OFFSET = 18;  // y offset per card-behind in px
const CARD_SCALE_STEP = 0.05;

const Feedbacks = () => {
    const [active, setActive] = useState(0);
    const pauseRef = useRef(false);

    // Auto-advance every 6s, pause on hover/focus
    useEffect(() => {
        const id = setInterval(() => {
            if (pauseRef.current) return;
            setActive((i) => (i + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    const go = (dir) => {
        setActive((i) => (i + dir + testimonials.length) % testimonials.length);
    };

    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  From our clients</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    What <span className="text-gradient-accent">clients</span> say.
                </h2>
            </motion.div>

            <div className="mt-14 grid lg:grid-cols-12 gap-10 items-center">
                {/* Stack */}
                <div
                    className="lg:col-span-7 relative h-[420px] sm:h-[440px] [perspective:1400px]"
                    onMouseEnter={() => { pauseRef.current = true; }}
                    onMouseLeave={() => { pauseRef.current = false; }}
                >
                    {testimonials.map((t, i) => {
                        const offset = (i - active + testimonials.length) % testimonials.length;
                        const isTop = offset === 0;
                        const z = -offset;
                        const y = offset * CARD_OFFSET;
                        const scale = 1 - offset * CARD_SCALE_STEP;
                        const opacity = offset > 3 ? 0 : 1 - offset * 0.18;
                        const blur = offset === 0 ? 0 : offset * 1.5;

                        return (
                            <motion.figure
                                key={t.name + i}
                                animate={{
                                    y,
                                    z,
                                    scale,
                                    opacity,
                                    filter: `blur(${blur}px)`,
                                }}
                                transition={{type: "spring", stiffness: 140, damping: 22, mass: 0.6}}
                                className={cn(
                                    "absolute inset-0 rounded-3xl glass p-8 sm:p-10 flex flex-col transform-gpu will-change-transform",
                                    isTop ? "pointer-events-auto" : "pointer-events-none"
                                )}
                                style={{transformStyle: "preserve-3d", zIndex: testimonials.length - offset}}
                            >
                                <div className="font-display text-6xl text-accent/70 leading-none mb-3 select-none">
                                    "
                                </div>
                                <blockquote className="text-white/90 text-[17px] sm:text-[19px] leading-relaxed flex-1">
                                    {t.testimonial}
                                </blockquote>
                                <figcaption className="mt-8 flex items-center gap-4">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        width="48"
                                        height="48"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/15"
                                    />
                                    <div className="leading-tight">
                                        <div className="text-white text-base font-semibold">{t.name}</div>
                                        <div className="text-muted text-xs">{t.designation} · {t.company}</div>
                                    </div>
                                </figcaption>
                            </motion.figure>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted">
                        {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => go(-1)}
                            aria-label="Previous testimonial"
                            className="w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors btn-magnetic"
                            data-magnet
                        >
                            <FiArrowLeft/>
                        </button>
                        <button
                            onClick={() => go(1)}
                            aria-label="Next testimonial"
                            className="w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors btn-magnetic"
                            data-magnet
                        >
                            <FiArrowRight/>
                        </button>
                    </div>
                    <div className="flex gap-1.5">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                                className={cn(
                                    "h-1 rounded-full transition-all",
                                    i === active ? "w-10 bg-gradient-to-r from-accent to-accent-2" : "w-4 bg-white/15 hover:bg-white/35"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SectionWrapper(Feedbacks, "voices");
