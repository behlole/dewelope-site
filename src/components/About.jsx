import React from "react";
import {motion} from "framer-motion";
import {FiArrowUpRight} from "react-icons/fi";
import {styles} from "../style.js";
import {services} from "../constants/index.js";
import {fadeIn, textVariant} from "../utils/motion.js";
import SectionWrapper from "../hoc/index.js";
import {cn} from "../utils/cn.js";

const ServiceCard = ({service, index}) => (
    <motion.article
        variants={fadeIn("up", "spring", index * 0.06, 0.7)}
        className="group relative rounded-3xl glass overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03]"
    >
        {/* top-right glow */}
        <div
            className={cn(
                "pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700",
                index % 4 === 0 && "bg-accent",
                index % 4 === 1 && "bg-accent-2",
                index % 4 === 2 && "bg-accent-4",
                index % 4 === 3 && "bg-accent-3"
            )}
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
            <p className="mt-3 text-secondary text-[15px] leading-relaxed">
                {service.description}
            </p>
        </div>
        {/* hover underline */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent-2 to-accent-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
    </motion.article>
);

const About = () => {
    return (
        <>
            {/* Section heading — editorial, spacious */}
            <motion.div variants={textVariant()} className="grid lg:grid-cols-12 gap-10 items-end mb-16">
                <div className="lg:col-span-7">
                    <p className={styles.sectionSubText}>·  What we do</p>
                    <h2 className={`${styles.sectionHeadText} mt-3 max-w-3xl`}>
                        A focused studio for <span className="text-gradient-accent">modern platforms</span>.
                    </h2>
                </div>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className="lg:col-span-5 text-secondary text-[17px] leading-[30px]"
                >
                    We plug into your team, own the hard parts, and leave the codebase cleaner than
                    we found it. Small senior team. Banking-scale rigor. Ship-fast mindset.
                </motion.p>
            </motion.div>

            {/* Services grid — 3 columns on desktop, clean cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {services.map((service, index) => (
                    <ServiceCard key={service.title} service={service} index={index}/>
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(About, "services");
