import React from "react";
import {FiArrowUp, FiGithub, FiLinkedin, FiMail, FiTwitter} from "react-icons/fi";
import {profile, navLinks} from "../constants/index.js";

const Footer = () => {
    return (
        <footer className="relative z-10 mt-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-glow">
                            <img src="/logo.svg" alt="" width="40" height="40" className="w-10 h-10"/>
                        </div>
                        <div>
                            <div className="font-display font-semibold text-[22px] tracking-tight leading-none">
                                <span className="text-white">de</span><span className="text-gradient-accent">we</span><span className="text-white">lope</span>
                            </div>
                            <div className="text-xs text-muted font-mono uppercase tracking-wider mt-1">{profile.role}</div>
                        </div>
                    </div>
                    <p className="mt-5 text-secondary text-sm max-w-sm leading-relaxed">
                        A focused software house shipping modern platforms, financial systems and branchless-banking infrastructure from {profile.location}. Available for new engagements worldwide.
                    </p>
                </div>

                <div className="md:col-span-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted mb-4">Sitemap</div>
                    <ul className="space-y-2">
                        {navLinks.map((l) => (
                            <li key={l.id}>
                                <a href={`#${l.id}`}
                                   className="text-white/80 hover:text-white text-sm transition-colors">
                                    {l.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted mb-4">Elsewhere</div>
                    <div className="flex gap-3">
                        <a href={`mailto:${profile.email}`}
                           className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                            <FiMail/>
                        </a>
                        <a href={profile.socials.github} target="_blank" rel="noreferrer"
                           className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                            <FiGithub/>
                        </a>
                        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer"
                           className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                            <FiLinkedin/>
                        </a>
                        <a href={profile.socials.twitter} target="_blank" rel="noreferrer"
                           className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent-2 transition-colors">
                            <FiTwitter/>
                        </a>
                    </div>

                    <a href="#hero"
                       className="mt-8 inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors">
                        <FiArrowUp/> Back to top
                    </a>
                </div>
            </div>

            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
                    <div>© {new Date().getFullYear()} Dewelope · Crafted with React, Three.js & care.</div>
                    <div className="font-mono">dewelope.com · {profile.location}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
