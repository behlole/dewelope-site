import React, {useMemo, useRef} from "react";
import {motion, useScroll, useTransform, useSpring} from "framer-motion";
import {styles} from "../style.js";
import {technologies} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";

// Seeded pseudo-random (deterministic scatter)
const rand = (seed) => {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
};

const Tech = () => {
    const sectionRef = useRef(null);
    const {scrollYProgress} = useScroll({
        target: sectionRef,
        offset: ["start 80%", "end 20%"],
    });
    const progress = useSpring(scrollYProgress, {stiffness: 70, damping: 20});
    const rotate = useTransform(progress, [0, 1], [0, 90]);
    const drift = useTransform(progress, [0, 1], [0, -40]);

    // Distribute tech chips across concentric rings with deterministic randomness
    const placed = useMemo(() => {
        const r = rand(42);
        const rings = [
            {radius: 18, count: 7},
            {radius: 34, count: 11},
            {radius: 48, count: 14},
        ];
        const slots = [];
        rings.forEach((ring) => {
            for (let i = 0; i < ring.count; i++) {
                const angle = (i / ring.count) * Math.PI * 2 + r() * 0.3;
                slots.push({
                    angle,
                    radius: ring.radius + (r() - 0.5) * 6,
                    depth: r(),      // 0..1 → controls opacity / scale
                    delay: r() * 0.8,
                });
            }
        });
        return technologies.slice(0, slots.length).map((t, i) => ({tech: t, ...slots[i]}));
    }, []);

    return (
        <div ref={sectionRef} className="relative">
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  Toolbelt</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    Stacks we <span className="text-gradient-accent">live in</span>.
                </h2>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className="mt-5 text-secondary text-[16px] max-w-2xl leading-[28px]"
                >
                    What we run in production.
                </motion.p>
            </motion.div>

            {/* Orbital galaxy */}
            <motion.div
                style={{rotate, y: drift}}
                className="relative mx-auto mt-16 aspect-square max-w-[900px] [perspective:1400px]"
            >
                {/* concentric guide rings */}
                {[18, 34, 48].map((r) => (
                    <div
                        key={r}
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                        style={{width: `${r * 2}%`, height: `${r * 2}%`}}
                    />
                ))}

                {/* center glow */}
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl"
                    style={{background: "radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)"}}
                />
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-2 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
                />

                {placed.map(({tech, angle, radius, depth, delay}, i) => {
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    const scale = 0.85 + depth * 0.35;
                    const opacity = 0.55 + depth * 0.45;
                    return (
                        <motion.div
                            key={tech.name}
                            initial={{opacity: 0, scale: 0.6}}
                            whileInView={{opacity, scale}}
                            viewport={{once: true, amount: 0.2}}
                            transition={{delay: delay + 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1]}}
                            className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
                            style={{left: `${x}%`, top: `${y}%`}}
                        >
                            <motion.div
                                whileHover={{scale: 1.15, opacity: 1}}
                                transition={{type: "spring", stiffness: 220, damping: 18}}
                                className="flex items-center gap-2 glass rounded-full pl-2 pr-3.5 py-1.5 hover:bg-white/10 transition-colors cursor-pointer"
                                data-magnet
                            >
                                <img
                                    src={tech.icon}
                                    alt=""
                                    width="18"
                                    height="18"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-[18px] h-[18px] object-contain"
                                />
                                <span className="text-xs text-white font-medium whitespace-nowrap">{tech.name}</span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default SectionWrapper(Tech, "stack");
