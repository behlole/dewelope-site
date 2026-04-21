import React, {useRef, useState} from "react";
import {AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring} from "framer-motion";
import {FiArrowUpRight, FiPlay} from "react-icons/fi";
import {styles} from "../style.js";
import {projects} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";
import ProjectDetail from "./ProjectDetail.jsx";
import ProjectCanvas from "./canvas/ProjectCanvas.jsx";

const TILT_MAX = 8;

const ProjectCard = ({project, index, onOpen}) => {
    const ref = useRef(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const rxS = useSpring(rx, {stiffness: 180, damping: 22});
    const rySp = useSpring(ry, {stiffness: 180, damping: 22});
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
        background: useMotionTemplate`radial-gradient(360px circle at ${useMotionTemplate`calc(${glowX} * 100%)`} ${useMotionTemplate`calc(${glowY} * 100%)`}, rgba(124,92,255,0.22), transparent 60%)`,
    };

    const {name, company, description, tags, motif3D, tint, metric} = project;
    const layoutId = `project-${project.name}`;

    return (
        <motion.button
            ref={ref}
            layoutId={layoutId}
            variants={fadeIn("up", "spring", (index % 2) * 0.08, 0.7)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onClick={() => onOpen(project, layoutId)}
            className="group relative w-full aspect-[16/11] rounded-3xl overflow-hidden glass text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
            style={{
                rotateX: rxS,
                rotateY: rySp,
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
            }}
            data-magnet
            aria-label={`${name} — open case study`}
        >
            {/* Live 3D cover — unique motif per project */}
            <ProjectCanvas motif={motif3D} tint={tint || "#7c5cff"}/>

            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={overlayStyle}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/10"/>

            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-start justify-between gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/75 glass px-3 py-1.5 rounded-full">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                    {metric && (
                        <span className="inline-flex items-baseline gap-1.5 glass px-3 py-1.5 rounded-full">
                            <span className="font-display text-white font-bold text-sm">{metric.value}</span>
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/60">{metric.label}</span>
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/75 glass px-3 py-1.5 rounded-full group-hover:text-white group-hover:bg-white/10 transition-colors">
                        <FiPlay className="text-[9px]"/>
                        <span>Open</span>
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-2 mb-2">
                    {company || "Case study"}
                </div>
                <h3 className="font-display text-white font-bold text-2xl sm:text-3xl leading-tight">
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
    const [active, setActive] = useState(null);
    const handleOpen = (project, layoutId) => setActive({project, layoutId});
    const handleClose = () => setActive(null);

    return (
        <>
            <motion.div variants={textVariant()}>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                        <p className={styles.sectionSubText}>·  Selected work</p>
                        <h2 className={`${styles.sectionHeadText} mt-3`}>
                            Work we're <span className="text-gradient-accent">proud</span> of.
                        </h2>
                    </div>
                    <p className="text-secondary text-[15px] max-w-sm leading-relaxed">
                        Flagship engagements — click any card to explore.
                    </p>
                </div>
            </motion.div>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {projects.map((p, i) => (
                    <ProjectCard key={p.name} project={p} index={i} onOpen={handleOpen}/>
                ))}
            </div>

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

export default SectionWrapper(Works, "work");
