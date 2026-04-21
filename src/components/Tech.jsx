import React, {useMemo} from "react";
import {motion} from "framer-motion";
import SectionWrapper from "../hoc/index.js";
import {technologies} from "../constants/index.js";
import {styles} from "../style.js";
import {fadeIn, textVariant} from "../utils/motion.js";

const TechChip = ({tech}) => (
    <div className="flex items-center gap-3 px-5 py-3 mx-2 rounded-2xl glass border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 shrink-0">
        <img src={tech.icon} alt="" width="24" height="24" loading="lazy" decoding="async" className="w-6 h-6 object-contain opacity-90"/>
        <span className="text-white font-medium text-sm whitespace-nowrap">{tech.name}</span>
    </div>
);

const Marquee = ({items, reverse = false, duration = 40}) => (
    <div className="marquee-pause overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
            className="flex w-max"
            style={{
                animation: `marquee ${duration}s linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
            }}
        >
            {[...items, ...items].map((t, i) => (
                <TechChip key={`${t.name}-${i}`} tech={t}/>
            ))}
        </div>
    </div>
);

// Preferred display order — anything not listed here will still render,
// just appended at the end (so future additions don't silently disappear).
const preferredOrder = [
    "Frontend",
    "Backend",
    "Languages",
    "Data",
    "Cloud & DevOps",
    "AI & Integrations",
];

const Tech = () => {
    const {grouped, ordered} = useMemo(() => {
        const map = {};
        technologies.forEach((t) => {
            const cat = t.category || "Other";
            (map[cat] ||= []).push(t);
        });
        const seen = new Set();
        const order = [];
        preferredOrder.forEach((c) => {
            if (map[c]) {
                order.push(c);
                seen.add(c);
            }
        });
        Object.keys(map).forEach((c) => {
            if (!seen.has(c)) order.push(c);
        });
        return {grouped: map, ordered: order};
    }, []);

    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  Toolbelt</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    Stacks I <span className="text-gradient-accent">live in</span>.
                </h2>
            </motion.div>

            <motion.p
                variants={fadeIn("", "", 0.1, 1)}
                className="mt-5 text-secondary text-[16px] max-w-2xl leading-[28px]"
            >
                What we run in production. Grouped by purpose.
            </motion.p>

            {/* Marquees */}
            <div className="mt-10 flex flex-col gap-4">
                <Marquee items={technologies} duration={50}/>
                <Marquee items={[...technologies].reverse()} reverse duration={60}/>
            </div>

            {/* Category buckets */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ordered.map((cat, i) => (
                    <motion.div
                        key={cat}
                        variants={fadeIn("up", "spring", 0.05 * i, 0.6)}
                        className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-white text-lg font-semibold">{cat}</h4>
                            <span className="text-xs font-mono text-muted">
                                {grouped[cat].length.toString().padStart(2, "0")}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {grouped[cat].map((t) => (
                                <div
                                    key={t.name}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                                >
                                    <img src={t.icon} alt="" width="16" height="16" loading="lazy" decoding="async" className="w-4 h-4 object-contain opacity-80"/>
                                    <span className="text-xs text-white/90">{t.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(Tech, "");
