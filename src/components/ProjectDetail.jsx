import React, {useEffect} from "react";
import {motion} from "framer-motion";
import {FiArrowUpRight, FiExternalLink, FiGithub, FiX} from "react-icons/fi";

const ProjectDetail = ({project, onClose, layoutId}) => {
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = originalOverflow;
        };
    }, [onClose]);

    if (!project) return null;

    const {
        name, company, description, metric, tags,
        image, coverArt, live_link, source_code_link,
    } = project;

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            className="fixed inset-0 z-[80] bg-primary/85 backdrop-blur-xl"
            onClick={onClose}
        >
            <div className="absolute inset-0 overflow-y-auto">
                <div
                    className="min-h-full flex items-center justify-center px-4 sm:px-10 py-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.article
                        layoutId={layoutId}
                        transition={{duration: 0.55, ease: [0.2, 0.8, 0.2, 1]}}
                        className="relative w-full max-w-6xl rounded-3xl glass-strong overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10"
                        >
                            <FiX/>
                        </button>

                        <div className="grid lg:grid-cols-12">
                            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[520px] overflow-hidden">
                                {image ? (
                                    <motion.img
                                        src={image}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                        initial={{scale: 1.08}}
                                        animate={{scale: 1}}
                                        transition={{duration: 0.7, ease: [0.2, 0.8, 0.2, 1]}}
                                    />
                                ) : coverArt ? (
                                    <div
                                        className="w-full h-full relative"
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
                                    </div>
                                ) : null}
                                {metric && (
                                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-2 rounded-full glass-strong">
                                        <span className="font-display text-white font-bold text-sm">{metric.value}</span>
                                        <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                                            {metric.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col">
                                <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2 mb-3">
                                    {company || "Case study"}
                                </div>
                                <h3 className="font-display text-white font-bold leading-tight text-3xl sm:text-4xl lg:text-[44px]">
                                    {name}
                                </h3>
                                <p className="mt-5 text-secondary leading-relaxed text-[15px]">
                                    {description}
                                </p>

                                {tags?.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {tags.map((t) => (
                                            <span
                                                key={`${name}-${t.name}`}
                                                className="px-3 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-white/85"
                                            >
                                                #{t.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {(live_link || source_code_link) && (
                                    <div className="mt-auto pt-8 flex flex-wrap items-center gap-3">
                                        {live_link && (
                                            <a href={live_link} target="_blank" rel="noreferrer"
                                               className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary text-sm font-semibold">
                                                Visit live <FiArrowUpRight/>
                                            </a>
                                        )}
                                        {source_code_link && (
                                            <a href={source_code_link} target="_blank" rel="noreferrer"
                                               className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-white text-sm">
                                                <FiGithub/> Source
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.article>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectDetail;
