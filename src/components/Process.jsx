import React from "react";
import {motion} from "framer-motion";
import {styles} from "../style.js";
import {processSteps} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";

const Process = () => {
    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  How we work</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    A process built to <span className="text-gradient-accent">ship</span>.
                </h2>
                <p className="mt-5 text-secondary text-[16px] max-w-2xl leading-[28px]">
                    Five stages, tight loops, no fluff.
                </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {processSteps.map((s, i) => (
                    <motion.div
                        key={s.step}
                        variants={fadeIn("up", "spring", i * 0.08, 0.7)}
                        className="relative rounded-2xl glass p-6 overflow-hidden group hover:-translate-y-1 transition-all duration-500"
                    >
                        <div
                            className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25 bg-accent group-hover:opacity-40 transition-opacity"/>
                        <div className="relative z-10 flex flex-col h-full min-h-[200px]">
                            <div
                                className="font-mono text-sm uppercase tracking-widest text-accent-2 opacity-80">
                                {s.step}
                            </div>
                            <h3 className="mt-3 font-display text-xl text-white font-semibold">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-secondary text-sm leading-relaxed">
                                {s.description}
                            </p>
                            <div className="mt-auto pt-5 flex items-center gap-1">
                                {Array.from({length: processSteps.length}).map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={
                                            idx <= i
                                                ? "h-1 w-6 rounded-full bg-gradient-to-r from-accent to-accent-2"
                                                : "h-1 w-6 rounded-full bg-white/8"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(Process, "process");
