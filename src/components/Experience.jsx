import React from "react";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import {motion} from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import {styles} from "../style.js";
import {experiences} from "../constants/index.js";
import SectionWrapper from "../hoc/index.js";
import {textVariant} from "../utils/motion.js";
import {cn} from "../utils/cn.js";

const Badge = ({badge}) => (
    <div
        className={cn(
            "w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br",
            badge.gradient
        )}
    >
        <span className="font-display font-bold text-white text-base tracking-wide">
            {badge.initials}
        </span>
    </div>
);

const ExperienceCard = ({experience}) => {
    return (
        <VerticalTimelineElement
            contentStyle={{
                background:
                    "linear-gradient(180deg, rgba(17,20,42,0.85) 0%, rgba(12,14,26,0.85) 100%)",
                color: "#fff",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 80px -25px rgba(124,92,255,0.3)",
                backdropFilter: "blur(14px)",
                padding: "26px",
            }}
            contentArrowStyle={{borderRight: "7px solid rgba(124,92,255,0.4)"}}
            date={
                <span className="text-secondary font-mono text-sm uppercase tracking-wider">
                    {experience.date}
                </span>
            }
            iconStyle={{
                background: experience.iconBg || "#1a1d33",
                boxShadow:
                    "0 0 0 4px rgba(124,92,255,0.4), inset 0 0 0 4px rgba(0,0,0,0.04)",
                padding: 0,
            }}
            icon={
                experience.badge ? (
                    <Badge badge={experience.badge}/>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <img
                            className="w-[60%] h-[60%] object-contain rounded-md"
                            src={experience.icon}
                            alt={experience.company_name}
                            width="48"
                            height="48"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                )
            }
        >
            <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-2"/>
                    <span className="text-xs font-mono uppercase tracking-wider text-accent-2">
                        {experience.company_name}
                    </span>
                    {experience.companyMeta && (
                        <span className="text-xs font-mono text-muted">
                            · {experience.companyMeta}
                        </span>
                    )}
                </div>
                <h3 className="font-display text-white text-2xl font-bold leading-tight">
                    {experience.title}
                </h3>
            </div>

            <ul className="mt-5 space-y-2.5">
                {experience.points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-secondary text-[14px] leading-relaxed">
                        <span className="text-accent mt-1.5 shrink-0">▸</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>

            {experience.stack && experience.stack.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {experience.stack.map((s) => (
                        <span
                            key={s}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-white/80"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            )}
        </VerticalTimelineElement>
    );
};

const Experience = () => {
    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  Studio lineage</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    Where we've <span className="text-gradient-accent">built</span>.
                </h2>
                <p className="mt-5 text-secondary text-[17px] max-w-3xl leading-[30px]">
                    Eight years of engineering pedigree — from PHP shops to banking-scale microservices,
                    across Elixir Technologies, Cloudtek, AKSA-SDS and Deltashoppe. The agency is new.
                    The rigour isn't.
                </p>
            </motion.div>
            <div className="mt-16 flex flex-col">
                <VerticalTimeline lineColor="rgba(124,92,255,0.25)">
                    {experiences.map((experience, index) => (
                        <ExperienceCard key={index} experience={experience}/>
                    ))}
                </VerticalTimeline>
            </div>
        </>
    );
};

export default SectionWrapper(Experience, "work");
