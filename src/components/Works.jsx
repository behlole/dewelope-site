import React from "react";
import {motion} from "framer-motion";
import {FiArrowUpRight, FiExternalLink, FiGithub, FiTrendingUp} from "react-icons/fi";
import {styles} from "../style.js";
import SectionWrapper from "../hoc/index.js";
import {projects} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import {cn} from "../utils/cn.js";

// Decorative cover-art rendered from gradient + motif — replaces fake screenshots
const CoverArt = ({coverArt, name, metric}) => {
    const {from, via, to, motif} = coverArt;
    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{
                background: `radial-gradient(circle at 30% 20%, ${from}55, transparent 50%), radial-gradient(circle at 80% 80%, ${via}55, transparent 55%), linear-gradient(180deg, ${to} 0%, #06070d 100%)`,
            }}
        >
            {/* grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage:
                        "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                }}
            />
            {/* big motif glyph */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="font-display font-bold uppercase tracking-tight select-none whitespace-nowrap text-white/[0.06]"
                    style={{fontSize: "clamp(80px, 14vw, 220px)", lineHeight: 1}}
                >
                    {motif}
                </div>
            </div>
            {/* dotted noise dots */}
            <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
                <defs>
                    <pattern id={`dots-${name}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill={from}/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dots-${name})`} opacity="0.18"/>
            </svg>
            {/* name overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/60">
                        case study
                    </div>
                    {metric && (
                        <div className="text-right">
                            <div className="text-3xl sm:text-4xl font-display font-bold text-white">
                                {metric.value}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mt-1">
                                {metric.label}
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="font-display text-2xl sm:text-3xl text-white font-semibold leading-tight">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectCard = ({
                         index,
                         name,
                         company,
                         description,
                         tags,
                         image,
                         coverArt,
                         metric,
                         source_code_link,
                         live_link,
                     }) => {
    const reverse = index % 2 === 1;
    return (
        <motion.div
            variants={fadeIn("up", "spring", 0.05 * index, 0.7)}
            className={cn(
                "group relative grid lg:grid-cols-12 gap-6 lg:gap-10 items-center",
                reverse && "lg:[&>*:first-child]:order-2"
            )}
        >
            {/* Visual */}
            <div className="lg:col-span-7 relative">
                <div className="relative rounded-3xl overflow-hidden glass aspect-[16/10]">
                    <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 z-20"/>
                    {coverArt ? (
                        <CoverArt coverArt={coverArt} name={name} metric={metric}/>
                    ) : (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                            decoding="async"
                            width="1400"
                            height="875"
                        />
                    )}
                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/0 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"/>
                    {/* corner action */}
                    {(live_link || source_code_link) && (
                        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0 transition-all duration-500">
                            {live_link && (
                                <a href={live_link} target="_blank" rel="noreferrer"
                                   className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:text-accent-2">
                                    <FiExternalLink/>
                                </a>
                            )}
                            {source_code_link && (
                                <a href={source_code_link} target="_blank" rel="noreferrer"
                                   className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:text-accent-2">
                                    <FiGithub/>
                                </a>
                            )}
                        </div>
                    )}
                    {/* index */}
                    <div className="absolute bottom-4 left-4 z-30 font-mono text-xs text-white/60 uppercase tracking-widest">
                        {String(index + 1).padStart(2, "0")} / {projects.length.toString().padStart(2, "0")}
                    </div>
                </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-5">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2 mb-3">
                    {company || `Project · ${String(index + 1).padStart(2, "0")}`}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold leading-tight">
                    {name}
                </h3>
                <p className="mt-4 text-secondary leading-relaxed">{description}</p>

                {metric && (
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent-2 text-sm font-mono">
                        <FiTrendingUp/>
                        <span className="text-white font-semibold">{metric.value}</span>
                        <span className="text-secondary">· {metric.label}</span>
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={`${name}-${tag.name}`}
                            className="px-3 py-1 rounded-full text-[12px] font-mono bg-white/5 border border-white/10 text-white/85"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>

                {(live_link || source_code_link) && (
                    <div className="mt-7 flex items-center gap-3">
                        {live_link && (
                            <a href={live_link} target="_blank" rel="noreferrer"
                               className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary text-sm font-semibold">
                                Visit live <FiArrowUpRight/>
                            </a>
                        )}
                        {source_code_link && (
                            <a href={source_code_link} target="_blank" rel="noreferrer"
                               className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-white text-sm font-medium hover:bg-white/10">
                                <FiGithub/> Source
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Works = () => {
    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  Selected work</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    Work we're <span className="text-gradient-accent">proud</span> of.
                </h2>
            </motion.div>
            <div className="w-full flex">
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className="mt-5 text-secondary text-[16px] max-w-2xl leading-[28px]"
                >
                    Flagship engagements. Numbers are real, NDAs apply.
                </motion.p>
            </div>
            <div className="mt-16 sm:mt-20 flex flex-col gap-16 sm:gap-20 lg:gap-24">
                {projects.map((project, index) => (
                    <ProjectCard key={`project-${index}`} index={index} {...project} />
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(Works, "projects");
