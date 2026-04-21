import React, {useRef, useState} from "react";
import {AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform} from "framer-motion";
import {FiArrowUpRight, FiPlay} from "react-icons/fi";
import {styles} from "../style.js";
import {projects} from "../constants/index.js";
import {cn} from "../utils/cn.js";
import ProjectDetail from "./ProjectDetail.jsx";

const TILT_MAX = 10; // deg

const Cover = ({coverArt, name, metric}) => (
    <div
        className="relative w-full h-full overflow-hidden"
        style={{
            background:
                `radial-gradient(circle at 30% 20%, ${coverArt.from}55, transparent 50%),
                 radial-gradient(circle at 80% 80%, ${coverArt.via}55, transparent 55%),
                 linear-gradient(180deg, ${coverArt.to} 0%, #06070d 100%)`,
        }}
    >
        <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="font-display font-bold uppercase tracking-tight text-white/[0.08]"
                style={{fontSize: "clamp(80px, 14vw, 220px)"}}
            >
                {coverArt.motif}
            </div>
        </div>
        {metric && (
            <div className="absolute top-5 right-5 text-right">
                <div className="font-display text-white text-3xl font-bold leading-none">{metric.value}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-white/60 mt-1">
                    {metric.label}
                </div>
            </div>
        )}
        <div className="absolute bottom-5 left-5 font-display text-white text-2xl font-semibold">{name}</div>
    </div>
);

const ReelCard = ({project, index, onOpen}) => {
    const ref = useRef(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const rxS = useSpring(rx, {stiffness: 200, damping: 22});
    const rySp = useSpring(ry, {stiffness: 200, damping: 22});
    const glowX = useMotionValue(0.5);
    const glowY = useMotionValue(0.5);

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        rx.set((0.5 - y) * TILT_MAX);
        ry.set((x - 0.5) * TILT_MAX);
        glowX.set(x);
        glowY.set(y);
    };
    const handleLeave = () => {
        rx.set(0);
        ry.set(0);
        glowX.set(0.5);
        glowY.set(0.5);
    };

    const overlayStyle = {
        background: useMotionTemplate`radial-gradient(380px circle at ${useMotionTemplate`calc(${glowX} * 100%)`} ${useMotionTemplate`calc(${glowY} * 100%)`}, rgba(124,92,255,0.25), transparent 65%)`,
    };

    const {
        name, company, description, tags, image, coverArt, metric, live_link, source_code_link,
    } = project;

    const layoutId = `project-${project.name}`;

    return (
        <motion.button
            ref={ref}
            layoutId={layoutId}
            onClick={() => onOpen(project, layoutId)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="group relative shrink-0 w-[84vw] sm:w-[72vw] md:w-[58vw] lg:w-[46vw] xl:w-[40vw] aspect-[16/11] rounded-3xl overflow-hidden glass text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
            style={{
                rotateX: rxS,
                rotateY: rySp,
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
            }}
            data-magnet
            aria-label={`${name} — open case study`}
        >
            <div className="absolute inset-0">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        width="1400"
                        height="875"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                ) : coverArt ? (
                    <Cover coverArt={coverArt} name={name} metric={metric}/>
                ) : (
                    <div className="w-full h-full bg-surface-2"/>
                )}
            </div>

            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={overlayStyle}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"/>

            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-start justify-between gap-3">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-white/75 glass px-3 py-1.5 rounded-full">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/70 glass px-3 py-1.5 rounded-full group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <FiPlay className="text-[9px]"/>
                    <span>Open</span>
                </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-9">
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-accent-2 mb-2">
                    {company || "Case study"}
                </div>
                <h3 className="font-display text-white font-bold text-2xl sm:text-3xl lg:text-[34px] leading-tight">
                    {name}
                </h3>
                <p className="mt-3 text-white/70 text-sm leading-relaxed line-clamp-2 max-w-lg">
                    {description}
                </p>
                {tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.slice(0, 4).map((t) => (
                            <span
                                key={`${name}-${t.name}`}
                                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/10 text-white/85"
                            >
                                #{t.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 text-white">
                <FiArrowUpRight className="text-2xl"/>
            </div>
        </motion.button>
    );
};

const Works = () => {
    const trackRef = useRef(null);
    const sectionRef = useRef(null);

    // Scroll progress through the tall outer section
    const {scrollYProgress} = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Map progress (0..1) to a horizontal translate
    // We'll compute travel based on projects count to reveal all cards.
    const travel = -70 * (projects.length - 1); // in vw
    const x = useTransform(scrollYProgress, [0, 1], [`0vw`, `${travel}vw`]);
    const xSpring = useSpring(x, {stiffness: 80, damping: 20, mass: 0.6});

    const [active, setActive] = useState(null); // {project, layoutId}

    const handleOpen = (project, layoutId) => setActive({project, layoutId});
    const handleClose = () => setActive(null);

    // Outer section height: tall enough to give horizontal travel room
    const outerHeight = `${projects.length * 65}vh`;

    return (
        <>
            <section
                id="work"
                ref={sectionRef}
                className="relative"
                style={{height: outerHeight}}
            >
                <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
                    {/* Section heading */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, amount: 0.3}}
                        transition={{duration: 0.6, ease: [0.2, 0.8, 0.2, 1]}}
                        className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 pb-6 sm:pb-10"
                    >
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <p className={styles.sectionSubText}>·  Selected work</p>
                                <h2 className={`${styles.sectionHeadText} mt-3`}>
                                    Work we're <span className="text-gradient-accent">proud</span> of.
                                </h2>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-muted pb-2">
                                <span>scroll</span>
                                <span className="h-px w-10 bg-white/20"/>
                                <span>→</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Reel */}
                    <div className="relative overflow-hidden">
                        <motion.div
                            ref={trackRef}
                            style={{x: xSpring}}
                            className="flex items-center gap-6 sm:gap-8 lg:gap-10 pl-6 sm:pl-10 pr-[30vw] will-change-transform"
                        >
                            {projects.map((p, i) => (
                                <ReelCard key={p.name} project={p} index={i} onOpen={handleOpen}/>
                            ))}
                        </motion.div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 pt-8">
                        <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-accent to-accent-2"
                                style={{
                                    scaleX: scrollYProgress,
                                    transformOrigin: "0 50%",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {active && (
                    <ProjectDetail
                        project={active.project}
                        layoutId={active.layoutId}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Works;
