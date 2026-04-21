import React, {useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";
import emailjs from "@emailjs/browser";
import {
    FiAlertCircle,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiGithub,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiTwitter,
} from "react-icons/fi";

import {EarthCanvas} from "./canvas";
import {slideIn} from "../utils/motion";
import SectionWrapper from "../hoc/index.js";
import {styles} from "../style.js";
import {profile} from "../constants/index.js";
import {cn} from "../utils/cn.js";

// === Config — read from Vite env, with sensible fallbacks ===
const EMAIL_TO = import.meta.env.VITE_CONTACT_EMAIL || profile.email;
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_READY = !!(EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_PUBLIC_KEY);

// === Validation ===
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validate = (form) => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Please share your name.";
    else if (form.name.trim().length < 2) errors.name = "That seems too short.";
    if (!form.email.trim()) errors.email = "An email so I can write back.";
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Hmm, that doesn't look like a valid email.";
    if (!form.message.trim()) errors.message = "Tell me a bit about what you're working on.";
    else if (form.message.trim().length < 10) errors.message = "A few more words, please — at least 10 characters.";
    return errors;
};

const Field = ({label, name, value, onChange, type = "text", textarea, rows, placeholder, error, maxLength, count}) => {
    const inputId = `contact-${name}`;
    const errorId = `${inputId}-error`;
    const className = cn(
        "mt-2 w-full bg-transparent border-b outline-none py-3 text-white placeholder:text-muted/60 transition-colors",
        textarea && "resize-none",
        error
            ? "border-accent-4 focus:border-accent-4"
            : "border-white/10 focus:border-accent-2"
    );
    return (
        <label htmlFor={inputId} className="block group">
            <div className="flex items-baseline justify-between">
                <span className={cn(
                    "text-xs font-mono uppercase tracking-wider transition-colors",
                    error ? "text-accent-4" : "text-muted group-focus-within:text-accent-2"
                )}>
                    {label} {error && <span aria-hidden> · {error}</span>}
                </span>
                {maxLength && (
                    <span className="text-[10px] font-mono text-muted">
                        {count}/{maxLength}
                    </span>
                )}
            </div>
            {textarea ? (
                <textarea
                    id={inputId}
                    rows={rows}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={className}
                />
            ) : (
                <input
                    id={inputId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete={name === "name" ? "name" : name === "email" ? "email" : "off"}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={className}
                />
            )}
            {error && <span id={errorId} className="sr-only">{error}</span>}
        </label>
    );
};

const Contact = () => {
    const formRef = useRef();
    const [form, setForm] = useState({name: "", email: "", message: "", _website: ""});
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [statusMsg, setStatusMsg] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
        if (errors[name]) setErrors((er) => ({...er, [name]: undefined}));
    };

    const reset = () => {
        setForm({name: "", email: "", message: "", _website: ""});
        setErrors({});
    };

    const sendViaMailto = () => {
        const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
        const body = encodeURIComponent(
            `${form.message}\n\n— ${form.name}\n${form.email}`
        );
        window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Honeypot — bots fill hidden fields; real users don't.
        if (form._website) {
            setStatus("success");
            setStatusMsg("Thanks!");
            reset();
            return;
        }
        const v = validate(form);
        if (Object.keys(v).length) {
            setErrors(v);
            setStatus("error");
            setStatusMsg("Please fix the highlighted fields.");
            return;
        }

        setStatus("sending");
        setStatusMsg("Sending…");

        if (!EMAILJS_READY) {
            // Graceful fallback: open the user's email client.
            sendViaMailto();
            setStatus("success");
            setStatusMsg("Opened your email client. Send when ready.");
            setTimeout(() => setStatus("idle"), 5000);
            return;
        }

        try {
            // Send the sender's address under several common template-variable
            // names so the EmailJS template can pick whichever it references.
            // The `reply_to` field, when wired to the template's Reply-To header,
            // makes hitting "Reply" in the inbox go straight to the client.
            await emailjs.send(
                EMAILJS_SERVICE,
                EMAILJS_TEMPLATE,
                {
                    from_name: form.name,
                    name: form.name,
                    user_name: form.name,
                    from_email: form.email,
                    email: form.email,
                    user_email: form.email,
                    reply_to: form.email,
                    to_name: profile.name,
                    to_email: EMAIL_TO,
                    subject: `Portfolio enquiry from ${form.name}`,
                    message: form.message,
                    // Ensure the email body always contains the address even if
                    // the template author forgot to add {{from_email}}.
                    message_html: `<p><strong>From:</strong> ${form.name} &lt;${form.email}&gt;</p><p>${form.message.replace(/\n/g, "<br/>")}</p><hr/><p><em>Reply to this email to respond directly to ${form.email}.</em></p>`,
                },
                EMAILJS_PUBLIC_KEY
            );
            setStatus("success");
            setStatusMsg(`Message sent — we'll reply to ${form.email} within 24h.`);
            reset();
            setTimeout(() => setStatus("idle"), 6000);
        } catch (err) {
            console.error("[Contact] EmailJS send failed:", err);
            setStatus("error");
            setStatusMsg("Couldn't send via the form. Try the direct email link below.");
        }
    };

    const buttonLabel = useMemo(() => {
        if (status === "sending") return "Sending…";
        if (status === "success") return "Sent ✓";
        if (status === "error") return "Try again";
        return EMAILJS_READY ? "Send message" : "Open in mail app";
    }, [status]);

    return (
        <div className="grid xl:grid-cols-12 gap-8 xl:gap-12 items-stretch">
            {/* Form panel */}
            <motion.div
                variants={slideIn("left", "tween", 0.2, 1)}
                className="xl:col-span-7 relative rounded-3xl glass p-6 sm:p-10 xl:p-12 overflow-hidden"
            >
                <div className="pointer-events-none absolute -top-32 -right-32 w-72 h-72 bg-accent rounded-full blur-3xl opacity-25"/>
                <div className="pointer-events-none absolute -bottom-32 -left-32 w-72 h-72 bg-accent-2 rounded-full blur-3xl opacity-20"/>

                <div className="relative z-10">
                    <p className={styles.sectionSubText}>·  Start a project</p>
                    <h3 className={`${styles.sectionHeadText} mt-3`}>
                        Let's <span className="text-gradient-accent">build</span> together.
                    </h3>
                    <p className="mt-4 text-secondary max-w-md">
                        Got a project, a platform to rebuild, or a problem to untangle? Tell us about it —
                        we read every message and reply within 24 hours.
                    </p>

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-10 flex flex-col gap-7"
                        aria-busy={status === "sending"}
                    >
                        <Field
                            label="Your name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ada Lovelace"
                            error={errors.name}
                            maxLength={80}
                            count={form.name.length}
                        />
                        <Field
                            label="Your email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ada@example.com"
                            error={errors.email}
                            maxLength={120}
                            count={form.email.length}
                        />
                        <Field
                            label="Message"
                            name="message"
                            textarea
                            rows={5}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Tell me about your project, timeline and what success looks like..."
                            error={errors.message}
                            maxLength={2000}
                            count={form.message.length}
                        />

                        {/* Honeypot — hidden from users, irresistible to bots */}
                        <label className="hidden" aria-hidden>
                            Website
                            <input
                                type="text"
                                name="_website"
                                tabIndex={-1}
                                autoComplete="off"
                                value={form._website}
                                onChange={handleChange}
                            />
                        </label>

                        {/* Submit + status */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className={cn(
                                    "btn-magnetic inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all",
                                    status === "success"
                                        ? "bg-accent-3 text-primary"
                                        : status === "error"
                                            ? "bg-accent-4 text-white"
                                            : "bg-white text-primary hover:shadow-glow",
                                    status === "sending" && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {buttonLabel}
                                {status === "idle" && <FiArrowUpRight/>}
                            </button>
                            <a
                                href={`mailto:${EMAIL_TO}`}
                                className="text-sm text-secondary hover:text-white transition-colors"
                            >
                                or email me directly →
                            </a>
                        </div>

                        {/* Live status region */}
                        <div
                            role="status"
                            aria-live="polite"
                            className={cn(
                                "text-sm flex items-center gap-2 transition-opacity",
                                status === "idle" && "opacity-0 h-0",
                                status === "success" && "text-accent-3",
                                status === "error" && "text-accent-4",
                                status === "sending" && "text-secondary"
                            )}
                        >
                            {status === "success" && <FiCheckCircle/>}
                            {status === "error" && <FiAlertCircle/>}
                            <span>{statusMsg}</span>
                        </div>

                        {!EMAILJS_READY && (
                            <p className="text-[11px] font-mono text-muted/70 leading-relaxed">
                                <span className="text-accent-2">i</span> EmailJS not configured —
                                form falls back to opening your mail client. Add{" "}
                                <code className="text-white/80">VITE_EMAILJS_*</code> keys in{" "}
                                <code className="text-white/80">.env</code> to enable in-app sending.
                            </p>
                        )}
                    </form>
                </div>
            </motion.div>

            {/* Side panel: globe + info cards */}
            <motion.div
                variants={slideIn("right", "tween", 0.2, 1)}
                className="xl:col-span-5 flex flex-col gap-5"
            >
                <div className="relative rounded-3xl glass overflow-hidden h-[300px] xl:h-[380px]">
                    <EarthCanvas/>
                    <div className="absolute bottom-4 left-4 text-xs font-mono uppercase tracking-widest text-muted">
                        Anywhere on the planet · Remote-friendly
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <a href={`mailto:${EMAIL_TO}`}
                       className="rounded-2xl glass p-5 hover:bg-white/[0.04] transition-colors group">
                        <FiMail className="text-accent-2 text-2xl mb-3"/>
                        <div className="text-xs font-mono uppercase tracking-wider text-muted">Email</div>
                        <div className="text-white text-sm font-medium mt-1 truncate">{EMAIL_TO}</div>
                    </a>
                    <div className="rounded-2xl glass p-5">
                        <FiMapPin className="text-accent text-2xl mb-3"/>
                        <div className="text-xs font-mono uppercase tracking-wider text-muted">Location</div>
                        <div className="text-white text-sm font-medium mt-1">{profile.location}</div>
                    </div>
                    <div className="rounded-2xl glass p-5">
                        <FiClock className="text-accent-3 text-2xl mb-3"/>
                        <div className="text-xs font-mono uppercase tracking-wider text-muted">Response</div>
                        <div className="text-white text-sm font-medium mt-1">Within 24h</div>
                    </div>
                    <div className="rounded-2xl glass p-5 flex flex-col">
                        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Find me</div>
                        <div className="flex gap-2 mt-auto">
                            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"
                               className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white">
                                <FiGithub/>
                            </a>
                            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                               className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white">
                                <FiLinkedin/>
                            </a>
                            <a href={profile.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"
                               className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white">
                                <FiTwitter/>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SectionWrapper(Contact, "contact");
