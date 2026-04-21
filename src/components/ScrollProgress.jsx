import React from "react";
import {motion, useScroll, useSpring} from "framer-motion";

const ScrollProgress = () => {
    const {scrollYProgress} = useScroll();
    const width = useSpring(scrollYProgress, {stiffness: 160, damping: 30, mass: 0.4});

    return (
        <motion.div
            aria-hidden
            style={{scaleX: width, transformOrigin: "0 50%"}}
            className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        />
    );
};

export default ScrollProgress;
