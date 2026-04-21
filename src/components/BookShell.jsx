import React, {lazy, Suspense, useCallback, useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {FiBookOpen, FiChevronLeft, FiChevronRight, FiX} from "react-icons/fi";
import About from "./About.jsx";
import {profile} from "../constants/index.js";
import {cn} from "../utils/cn.js";

const Works = lazy(() => import("./Works.jsx"));
const Process = lazy(() => import("./Process.jsx"));
const Tech = lazy(() => import("./Tech.jsx"));
const Feedbacks = lazy(() => import("./Feedbacks.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));
const Footer = lazy(() => import("./Footer.jsx"));
const CTA = lazy(() => import("./CTA.jsx"));

// Chapter 00 — Cover
const Cover = () => (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 sm:px-10 text-center">
        <div className="font-mono text-[11px] sm:text-xs text-accent-2 uppercase tracking-[0.4em] mb-8">
            · · · volume one · · ·
        </div>
        <h1 className="font-display font-bold text-white tracking-tight leading-[0.95] text-[64px] xs:text-[88px] sm:text-[128px] lg:text-[172px]">
            <span className="text-white">de</span><span className="text-gradient-accent">we</span><span className="text-white">lope</span>
        </h1>
        <div className="mt-6 sm:mt-8 font-display text-white/80 text-xl sm:text-2xl lg:text-3xl tracking-wide max-w-3xl">
            Modern software, <span className="text-gradient-warm">engineered for scale</span>.
        </div>
        <div className="mt-10 sm:mt-14 text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span>A software house</span>
            <span className="text-white/20">◆</span>
            <span>Rawalpindi · PK</span>
            <span className="text-white/20">◆</span>
            <span>MMXXVI</span>
        </div>
        <div className="mt-16 sm:mt-20 text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-muted animate-pulse">
            Turn the page →
        </div>
    </div>
);

// Chapter 07 — Colophon / end-plate (lighter, book-style)
const Colophon = () => (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 sm:px-10 text-center">
        <div className="font-mono text-[11px] sm:text-xs text-accent-2 uppercase tracking-[0.4em] mb-8">
            · · · colophon · · ·
        </div>
        <h2 className="font-display font-bold text-white tracking-tight leading-[1.0] text-[44px] xs:text-[56px] sm:text-[80px] lg:text-[96px] max-w-4xl">
            Thanks for reading.
        </h2>
        <div className="mt-8 sm:mt-10 max-w-xl text-secondary text-[15px] sm:text-[16px] leading-relaxed">
            Built in React, React Three Fiber and Tailwind. Typeset in Space Grotesk,
            Inter & JetBrains Mono. Dark mode first, shipped on GitHub Pages.
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
                href={`mailto:${profile.email}`}
                className="btn-magnetic px-6 py-3 rounded-full bg-white text-primary font-semibold text-sm"
            >
                {profile.email}
            </a>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted">
                © {new Date().getFullYear()} dewelope
            </span>
        </div>
    </div>
);

const PageFallback = ({label}) => (
    <div className="w-full h-full flex items-center justify-center text-muted">
        <div className="canvas-loader"/>
        <span className="ml-3 text-xs font-mono uppercase tracking-widest">{label}…</span>
    </div>
);

const chapters = [
    {id: "cover", num: "00", title: "Cover", render: () => <Cover/>},
    {id: "services", num: "01", title: "What We Do", render: () => <About/>},
    {id: "work", num: "02", title: "Our Work", render: () => (
        <Suspense fallback={<PageFallback label="Work"/>}><Works/></Suspense>
    )},
    {id: "process", num: "03", title: "Process", render: () => (
        <Suspense fallback={<PageFallback label="Process"/>}><Process/></Suspense>
    )},
    {id: "stack", num: "04", title: "The Stack", render: () => (
        <Suspense fallback={<PageFallback label="Stack"/>}><Tech/></Suspense>
    )},
    {id: "voices", num: "05", title: "Voices", render: () => (
        <Suspense fallback={<PageFallback label="Voices"/>}><Feedbacks/></Suspense>
    )},
    {id: "start", num: "06", title: "Start a Project", render: () => (
        <Suspense fallback={<PageFallback label="Start"/>}>
            <CTA/>
            <Contact/>
        </Suspense>
    )},
    {id: "colophon", num: "07", title: "Colophon", render: () => (
        <>
            <Colophon/>
            <Suspense fallback={null}><Footer/></Suspense>
        </>
    )},
];

const variantsFor = (direction) => ({
    enter: {
        rotateY: direction > 0 ? 70 : -70,
        opacity: 0,
        filter: "blur(8px)",
        transformOrigin: direction > 0 ? "left center" : "right center",
    },
    center: {
        rotateY: 0,
        opacity: 1,
        filter: "blur(0px)",
        transformOrigin: "center center",
        transition: {duration: 0.7, ease: [0.2, 0.8, 0.2, 1]},
    },
    exit: {
        rotateY: direction > 0 ? -70 : 70,
        opacity: 0,
        filter: "blur(8px)",
        transformOrigin: direction > 0 ? "right center" : "left center",
        transition: {duration: 0.55, ease: [0.8, 0.2, 0.8, 0.2]},
    },
});

const BookShell = () => {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [tocOpen, setTocOpen] = useState(false);
    const variants = useMemo(() => variantsFor(direction), [direction]);

    const goTo = useCallback((next) => {
        if (next < 0 || next >= chapters.length) return;
        setDirection(next > page ? 1 : -1);
        setPage(next);
        setTocOpen(false);
        // Reset internal scroll on page change
        requestAnimationFrame(() => {
            const el = document.getElementById("book-page-scroll");
            if (el) el.scrollTo({top: 0, behavior: "instant"});
        });
    }, [page]);

    const next = () => goTo(page + 1);
    const prev = () => goTo(page - 1);

    useEffect(() => {
        const onKey = (e) => {
            if (tocOpen) return;
            if (e.key === "ArrowRight" || e.key === "PageDown") {
                e.preventDefault();
                next();
            } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                e.preventDefault();
                prev();
            } else if (e.key === "Escape") {
                setTocOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [tocOpen, page]);

    // External navigation (Navbar CTA, etc.)
    useEffect(() => {
        const onGoto = (e) => {
            const id = e?.detail?.chapterId;
            const idx = chapters.findIndex((c) => c.id === id);
            if (idx >= 0) goTo(idx);
        };
        window.addEventListener("dewelope:goto", onGoto);
        return () => window.removeEventListener("dewelope:goto", onGoto);
    }, [goTo]);

    // Touch swipe support
    useEffect(() => {
        let x0 = null;
        const down = (e) => { x0 = e.touches ? e.touches[0].clientX : e.clientX; };
        const up = (e) => {
            if (x0 == null) return;
            const x1 = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const dx = x1 - x0;
            if (Math.abs(dx) > 80) { if (dx < 0) next(); else prev(); }
            x0 = null;
        };
        window.addEventListener("touchstart", down, {passive: true});
        window.addEventListener("touchend", up, {passive: true});
        return () => {
            window.removeEventListener("touchstart", down);
            window.removeEventListener("touchend", up);
        };
    }, [page]);

    // Scroll-triggered page turns:
    // - Native scroll still works INSIDE each page
    // - When the page is already scrolled to its top/bottom edge and the user
    //   keeps scrolling in that direction, accumulate overscroll and trigger
    //   a page flip.
    useEffect(() => {
        const OVERSCROLL_THRESHOLD = 140;
        const LOCKOUT_MS = 800;
        const EPS = 2;
        let locked = false;
        let accumulator = 0;
        let resetTimer = null;

        const resetAccumulator = () => {
            accumulator = 0;
            if (resetTimer) clearTimeout(resetTimer);
        };

        const flip = (dir) => {
            locked = true;
            resetAccumulator();
            if (dir > 0) next();
            else prev();
            setTimeout(() => { locked = false; }, LOCKOUT_MS);
        };

        const onWheel = (e) => {
            const el = document.getElementById("book-page-scroll");
            if (!el) return;
            if (locked) { e.preventDefault(); return; }
            const dy = e.deltaY;
            const atTop = el.scrollTop <= EPS;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - EPS;

            // Down-scroll past the bottom edge
            if (dy > 0 && atBottom) {
                e.preventDefault();
                accumulator += dy;
                if (accumulator > OVERSCROLL_THRESHOLD && page < chapters.length - 1) flip(1);
                if (resetTimer) clearTimeout(resetTimer);
                resetTimer = setTimeout(resetAccumulator, 220);
                return;
            }
            // Up-scroll past the top edge
            if (dy < 0 && atTop) {
                e.preventDefault();
                accumulator += dy;
                if (accumulator < -OVERSCROLL_THRESHOLD && page > 0) flip(-1);
                if (resetTimer) clearTimeout(resetTimer);
                resetTimer = setTimeout(resetAccumulator, 220);
                return;
            }
            // Normal in-page scroll — let the browser handle it
            resetAccumulator();
        };

        window.addEventListener("wheel", onWheel, {passive: false});
        return () => {
            window.removeEventListener("wheel", onWheel);
            if (resetTimer) clearTimeout(resetTimer);
        };
    }, [page, goTo]);

    const chapter = chapters[page];

    return (
        <div className="relative w-full min-h-[100svh] overflow-hidden" style={{perspective: 2000}}>
            {/* Page itself */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={chapter.id}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 will-change-transform"
                    style={{transformStyle: "preserve-3d", backfaceVisibility: "hidden"}}
                >
                    <div
                        id="book-page-scroll"
                        className="w-full h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col"
                    >
                        <div className="flex-1 flex flex-col pt-24 sm:pt-28 pb-28">
                            {chapter.render()}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Corner HUD — chapter number top-left, title top-right */}
            <div className="pointer-events-none fixed top-20 sm:top-24 left-6 sm:left-10 z-40 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-accent-2">
                chapter · {chapter.num}
            </div>
            <div className="pointer-events-none fixed top-20 sm:top-24 right-6 sm:right-10 z-40 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-muted hidden sm:block">
                {chapter.title}
            </div>

            {/* Bottom book controls */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-primary via-primary/80 to-transparent pt-10 pb-4 sm:pb-5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between gap-4">
                    {/* Prev */}
                    <button
                        onClick={prev}
                        disabled={page === 0}
                        aria-label="Previous page"
                        className={cn(
                            "w-11 h-11 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center text-white transition-all",
                            page === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 btn-magnetic"
                        )}
                    >
                        <FiChevronLeft className="text-lg"/>
                    </button>

                    {/* Page dots / TOC toggle */}
                    <div className="flex items-center gap-3 flex-1 justify-center">
                        <div className="hidden md:flex items-center gap-1.5">
                            {chapters.map((c, i) => (
                                <button
                                    key={c.id}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to chapter ${c.num}`}
                                    className={cn(
                                        "h-1 rounded-full transition-all",
                                        i === page ? "w-10 bg-gradient-to-r from-accent to-accent-2" : "w-4 bg-white/15 hover:bg-white/35"
                                    )}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setTocOpen((v) => !v)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[11px] font-mono uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors"
                        >
                            <FiBookOpen className="text-sm"/>
                            <span>Contents</span>
                        </button>
                        <div className="font-mono text-[11px] text-muted tracking-widest tabular-nums">
                            {String(page + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                        </div>
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        disabled={page === chapters.length - 1}
                        aria-label="Next page"
                        className={cn(
                            "w-11 h-11 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center text-white transition-all",
                            page === chapters.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 btn-magnetic"
                        )}
                    >
                        <FiChevronRight className="text-lg"/>
                    </button>
                </div>
            </div>

            {/* TOC overlay */}
            <AnimatePresence>
                {tocOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.25}}
                        className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex items-center justify-center px-6"
                        onClick={() => setTocOpen(false)}
                    >
                        <motion.div
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 10, opacity: 0}}
                            transition={{delay: 0.05, duration: 0.35, ease: [0.2, 0.8, 0.2, 1]}}
                            className="relative w-full max-w-2xl rounded-3xl glass-strong p-8 sm:p-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setTocOpen(false)}
                                aria-label="Close contents"
                                className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/10"
                            >
                                <FiX/>
                            </button>
                            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent-2 mb-5">
                                · contents ·
                            </div>
                            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-8 tracking-tight">
                                Table of Contents
                            </h2>
                            <ul className="flex flex-col gap-1">
                                {chapters.map((c, i) => (
                                    <li key={c.id}>
                                        <button
                                            onClick={() => goTo(i)}
                                            className={cn(
                                                "w-full flex items-center gap-5 px-3 py-3 sm:py-4 rounded-xl text-left transition-colors group",
                                                i === page ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <span className="font-mono text-xs tracking-[0.3em] text-accent-2 shrink-0">
                                                {c.num}
                                            </span>
                                            <span className="font-display text-lg sm:text-xl flex-1">
                                                {c.title}
                                            </span>
                                            <span className="font-mono text-[10px] text-muted tabular-nums">
                                                p. {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookShell;
