import React, {useRef} from "react";
import {motion, useMotionTemplate, useMotionValue, useSpring} from "framer-motion";
import {FiArrowUpRight} from "react-icons/fi";
import {styles} from "../style.js";
import {services} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";
import {cn} from "../utils/cn.js";

const TILT_MAX = 8; // degrees

const ServiceCard = ({service, index}) => {
    const ref = useRef(null);

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useSpring(useMotionValue(0), {stiffness: 180, damping: 20});
    const rotateY = useSpring(useMotionValue(0), {stiffness: 180, damping: 20});

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        mouseX.set(x);
        mouseY.set(y);
        rotateX.set((0.5 - y) * TILT_MAX);
        rotateY.set((x - 0.5) * TILT_MAX);
    };
    const handleLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    const glowX = useMotionTemplate`${useMotionTemplate`${mouseX}`}`;
    const overlayStyle = {
        background: useMotionTemplate`radial-gradient(300px circle at ${useMotionTemplate`calc(${mouseX} * 100%)`} ${useMotionTemplate`calc(${mouseY} * 100%)`}, rgba(124,92,255,0.18), transparent 60%)`,
    };

    return (
        <motion.article
            ref={ref}
            variants={fadeIn("up", "spring", index * 0.06, 0.7)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1000,
            }}
            className="group relative rounded-3xl glass overflow-hidden transition-colors duration-500 hover:bg-white/[0.03] will-change-transform"
        >
            {/* corner glow */}
            <div
                className={cn(
                    "pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700",
                    index % 4 === 0 && "bg-accent",
                    index % 4 === 1 && "bg-accent-2",
                    index % 4 === 2 && "bg-accent-4",
                    index % 4 === 3 && "bg-accent-3"
                )}
            />
            {/* mouse-follow spotlight */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={overlayStyle}
            />

            {/* top bar */}
            <div className="relative z-10 flex items-center justify-between px-7 pt-7">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <FiArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500"/>
            </div>
            {/* body */}
            <div className="relative z-10 px-7 pb-8 pt-8">
                <h3 className="font-display text-2xl sm:text-[26px] text-white font-semibold leading-tight">
                    {service.title}
                </h3>
                <p className="mt-3 text-secondary text-[14px] leading-relaxed">
                    {service.description}
                </p>
            </div>
            {/* hover underline */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent-2 to-accent-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
        </motion.article>
    );
};

const About = () => {
    return (
        <>
            {/* Heading — short, confident */}
            <motion.div variants={textVariant()} className="grid lg:grid-cols-12 gap-10 items-end mb-14">
                <div className="lg:col-span-7">
                    <p className={styles.sectionSubText}>·  What we do</p>
                    <h2 className={`${styles.sectionHeadText} mt-3 max-w-3xl`}>
                        A studio for <span className="text-gradient-accent">modern platforms</span>.
                    </h2>
                </div>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className="lg:col-span-5 text-secondary text-[16px] leading-[28px]"
                >
                    Small senior team. Banking-scale rigor. Ship-fast mindset.
                </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {services.map((service, index) => (
                    <ServiceCard key={service.title} service={service} index={index}/>
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(About, "services");
