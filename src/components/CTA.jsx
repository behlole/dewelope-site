import React from "react";
import {motion} from "framer-motion";
import {FiArrowUpRight, FiMail} from "react-icons/fi";
import {profile} from "../constants/index.js";

const CTA = () => {
    return (
        <section aria-label="Call to action" className="relative py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, amount: 0.3}}
                    transition={{duration: 0.8, ease: [0.2, 0.8, 0.2, 1]}}
                    className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden glass p-10 sm:p-16 lg:p-20"
                >
                    {/* Ambient gradient glows */}
                    <div className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full blur-3xl bg-accent opacity-30"/>
                    <div className="pointer-events-none absolute -bottom-40 -right-40 w-[540px] h-[540px] rounded-full blur-3xl bg-accent-2 opacity-25"/>
                    <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"/>

                    <div className="relative z-10 flex flex-col items-start lg:grid lg:grid-cols-12 lg:gap-10 lg:items-end">
                        <div className="lg:col-span-8">
                            <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2">
                                ·  Ready when you are
                            </div>
                            <h2 className="mt-4 font-display font-bold text-white tracking-tight leading-[1.04] text-[40px] xs:text-[48px] sm:text-[64px] lg:text-[80px]">
                                Let's build the <span className="text-gradient-accent">next platform</span>.
                            </h2>
                            <p className="mt-5 text-secondary text-[16px] sm:text-[17px] leading-relaxed max-w-xl">
                                Tell us about your product, platform or problem. We read every message
                                and reply within 24 hours.
                            </p>
                        </div>

                        <div className="lg:col-span-4 w-full mt-8 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                            <a
                                href="#contact"
                                className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-semibold text-base"
                            >
                                Start a project
                                <FiArrowUpRight/>
                            </a>
                            <a
                                href={`mailto:${profile.email}`}
                                className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-white font-medium text-base hover:bg-white/10 transition-colors"
                            >
                                <FiMail/>
                                {profile.email}
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
