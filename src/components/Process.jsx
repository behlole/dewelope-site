import React, {useRef} from "react";
import {motion, useScroll, useTransform, useSpring} from "framer-motion";
import {styles} from "../style.js";
import {processSteps} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";
import {cn} from "../utils/cn.js";

const Process = () => {
    const sectionRef = useRef(null);
    const {scrollYProgress} = useScroll({
        target: sectionRef,
        offset: ["start 80%", "end 20%"],
    });
    const progress = useSpring(scrollYProgress, {stiffness: 80, damping: 22, mass: 0.5});
    const lineScale = useTransform(progress, [0, 1], [0, 1]);

    return (
        <div ref={sectionRef} className="relative">
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  How we work</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    A process built to <span className="text-gradient-accent">ship</span>.
                </h2>
                <p className="mt-5 text-secondary text-[16px] max-w-2xl leading-[28px]">
                    Five stages, tight loops, no fluff.
                </p>
            </motion.div>

            {/* Desktop: horizontal timeline with scroll-driven connector */}
            <div className="hidden lg:block relative mt-20">
                {/* Base track */}
                <div className="absolute top-[22px] left-0 right-0 h-px bg-white/10"/>
                {/* Filled track (scroll-linked) */}
                <motion.div
                    aria-hidden
                    style={{scaleX: lineScale, transformOrigin: "0 50%"}}
                    className="absolute top-[22px] left-0 right-0 h-px bg-gradient-to-r from-accent via-accent-2 to-accent-3"
                />
                {/* Moving marker */}
                <motion.div
                    aria-hidden
                    style={{
                        left: useTransform(progress, [0, 1], ["0%", "100%"]),
                    }}
                    className="absolute -top-[4px] -translate-x-1/2 pointer-events-none"
                >
                    <div className="relative w-4 h-4 rounded-full bg-accent-2 shadow-[0_0_20px_rgba(34,211,238,0.9)]">
                        <span className="absolute inset-0 rounded-full bg-accent-2 animate-ping opacity-60"/>
                    </div>
                </motion.div>

                <div className="grid grid-cols-5 gap-6 pt-0">
                    {processSteps.map((s, i) => {
                        const threshold = (i + 0.5) / processSteps.length;
                        return <ProcessNode key={s.step} step={s} index={i} threshold={threshold} progress={progress}/>;
                    })}
                </div>
            </div>

            {/* Mobile / tablet: vertical stack */}
            <div className="lg:hidden mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
                {processSteps.map((s, i) => (
                    <motion.div
                        key={s.step}
                        variants={fadeIn("up", "spring", i * 0.08, 0.7)}
                        className="relative rounded-2xl glass p-6 overflow-hidden"
                    >
                        <div className="font-mono text-sm uppercase tracking-widest text-accent-2">{s.step}</div>
                        <h3 className="mt-3 font-display text-xl text-white font-semibold">{s.title}</h3>
                        <p className="mt-3 text-secondary text-sm leading-relaxed">{s.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const ProcessNode = ({step, index, threshold, progress}) => {
    // When scroll progress is past this node's threshold, light up.
    const lit = useTransform(progress, (v) => (v >= threshold ? 1 : 0));
    const scale = useTransform(progress, (v) => (v >= threshold ? 1.0 : 0.85));
    const nodeBg = useTransform(lit, [0, 1], ["rgba(255,255,255,0.12)", "rgba(34,211,238,1)"]);
    const labelOp = useTransform(lit, [0, 1], [0.5, 1]);

    return (
        <div className="relative flex flex-col items-center text-center">
            <motion.div
                style={{background: nodeBg, scale}}
                className="relative w-11 h-11 rounded-full flex items-center justify-center border border-white/20 ring-4 ring-primary z-10"
            >
                <span className="font-mono text-xs text-white font-semibold tracking-widest">
                    {step.step}
                </span>
            </motion.div>
            <motion.div style={{opacity: labelOp}} className="mt-8">
                <h3 className="font-display text-white text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-secondary text-sm leading-relaxed max-w-[210px] mx-auto">
                    {step.description}
                </p>
            </motion.div>
        </div>
    );
};

export default SectionWrapper(Process, "process");
