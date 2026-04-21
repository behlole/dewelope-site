import React from "react";
import {motion} from "framer-motion";
import {styles} from "../style.js";
import {staggerContainer} from "../utils/motion.js";

const SectionWrapper = (Component, idName) =>
    function HOC() {
        return (
            <motion.section
                variants={staggerContainer(0.08, 0)}
                initial="hidden"
                whileInView="show"
                // `amount: "some"` fires when ANY pixel of the section enters
                // the viewport. With 0.25 (the old value), tall sections
                // (Works has 6 projects, ~3500px) could never reach the
                // threshold, leaving every child stuck at opacity:0 forever.
                viewport={{once: true, amount: "some", margin: "0px 0px -10% 0px"}}
                className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
            >
                <span className="hash-span" id={idName}>
                    &nbsp;
                </span>
                <Component/>
            </motion.section>
        );
    };

export default SectionWrapper;
