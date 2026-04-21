import React from "react";
import {motion} from "framer-motion";

const CLIENTS = [
    "EasyPaisa",
    "JazzCash",
    "FoodPanda",
    "ZTBL",
    "TPL Trakker",
    "MySimpleRx",
    "FlexiGolf",
    "Chotok",
    "UGAP",
    "EdFry",
    "VARS",
];

const Clients = () => {
    return (
        <section
            aria-label="Clients"
            className="relative py-12 sm:py-16 border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted shrink-0">
                        ·  Trusted by teams behind
                    </div>
                    <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, amount: 0.2}}
                            transition={{duration: 0.7, ease: [0.2, 0.8, 0.2, 1]}}
                            className="flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-10"
                        >
                            {CLIENTS.map((c) => (
                                <span
                                    key={c}
                                    className="font-display text-lg sm:text-xl lg:text-[22px] font-semibold text-white/60 hover:text-white transition-colors duration-300"
                                >
                                    {c}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;
