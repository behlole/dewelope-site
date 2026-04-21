import React from "react";
import {motion} from "framer-motion";
import {fadeIn, textVariant} from "../utils/motion";
import {testimonials} from "../constants";
import {styles} from "../style.js";
import SectionWrapper from "../hoc/index.js";
import {cn} from "../utils/cn.js";

const FeedbackCard = ({index, testimonial, name, designation, company, image}) => (
    <motion.figure
        variants={fadeIn("up", "spring", index * 0.08, 0.7)}
        className={cn(
            "relative rounded-3xl glass p-7 group hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
        )}
    >
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
        <div className="font-display text-5xl text-accent leading-none mb-2">"</div>
        <blockquote className="text-white/90 text-[15px] leading-relaxed flex-1">
            {testimonial}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
            <img
                src={image}
                alt={name}
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="leading-tight">
                <div className="text-white text-sm font-semibold">{name}</div>
                <div className="text-muted text-xs">{designation} · {company}</div>
            </div>
        </figcaption>
    </motion.figure>
);

const Feedbacks = () => {
    return (
        <>
            <motion.div variants={textVariant()}>
                <p className={styles.sectionSubText}>·  From our clients</p>
                <h2 className={`${styles.sectionHeadText} mt-3`}>
                    What <span className="text-gradient-accent">clients</span> say.
                </h2>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {testimonials.map((t, i) => (
                    <FeedbackCard key={`${t.name}-${i}`} index={i} {...t} />
                ))}
            </div>
        </>
    );
};

export default SectionWrapper(Feedbacks, "");
