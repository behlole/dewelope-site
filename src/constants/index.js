import {
    mobile,
    backend,
    creator,
    web,
    typescript,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    docker,
    java,
    angular,
    laravel,
    nextjs,
    postgresql,
    git,
    cloudtek,
    aksaSds,
    deltaShoppe,
    mysimplerx,
    vars,
    flexigolf,
    chotok,
    ugap,
    edfry,
} from "../assets";

// === Agency identity ===
export const profile = {
    name: "Dewelope",
    firstName: "Dewelope",
    lastName: "",
    role: "Modern Software House",
    tagline:
        "Enterprise platforms, financial systems and branchless-banking infrastructure — shipped with banking-scale rigor.",
    shortTagline: "Modern software, engineered for scale.",
    location: "Rawalpindi, Pakistan · Remote-first",
    availability: "Available for new engagements — worldwide",
    email: "hello@dewelope.com",
    phone: "+92 335 8432691",
    website: "https://dewelope.com",
    socials: {
        github: "https://github.com/behlole",
        linkedin: "https://linkedin.com/in/behlole",
        twitter: "https://twitter.com/",
    },
    founder: {
        name: "Engr M Behlole Aqil",
        title: "Founder & Principal Engineer",
        bio: "Eight years shipping enterprise platforms, branchless-banking systems and fintech infrastructure across Cloudtek, Elixir, AKSA-SDS and Deltashoppe — for clients including EasyPaisa, JazzCash, FoodPanda, ZTBL and MySimpleRx.",
        linkedin: "https://linkedin.com/in/behlole",
        github: "https://github.com/behlole",
    },
    resumeUrl: null,
};

export const navLinks = [
    {id: "services", title: "Services"},
    {id: "work", title: "Work"},
    {id: "process", title: "Process"},
    {id: "contact", title: "Contact"},
];

// Headline stats — agency proof points
export const heroStats = [
    {label: "Years shipping", value: "8+"},
    {label: "Production systems", value: "20+"},
    {label: "Stacks mastered", value: "30+"},
    {label: "Client engagements", value: "50+"},
];

// Agency services — what clients hire us for
const services = [
    {
        title: "Full-Stack Engineering",
        description: "Angular, React, Next.js on Node, NestJS and Spring Boot. Schema to screen.",
        icon: web,
    },
    {
        title: "Microservices & Cloud",
        description: "Spring Cloud, GraphQL, REST. Clean boundaries, CI/CD, infra that scales.",
        icon: backend,
    },
    {
        title: "Fintech & Banking",
        description: "Wallets, branchless banking, core flows. Audit-hardened, millions of users.",
        icon: creator,
    },
    {
        title: "Legacy Modernization",
        description: "Query tuning, schema migration, incremental rewrites. Latency down, scale up.",
        icon: mobile,
    },
    {
        title: "AI Integration",
        description: "LangChain, OpenAI, Anthropic. Production RAG, evals, guardrails.",
        icon: creator,
    },
    {
        title: "Staff Augmentation",
        description: "Senior engineers into your team, under your standards. Not parachuted.",
        icon: backend,
    },
];

// Process — how we work
const processSteps = [
    {
        step: "01",
        title: "Discover",
        description: "Map the real constraints. Align on what success looks like. One week.",
    },
    {
        step: "02",
        title: "Architect",
        description: "Pick the stack, draw the boundaries, ship the first slice behind a flag.",
    },
    {
        step: "03",
        title: "Build",
        description: "Tight increments, continuous delivery, weekly demos. No ceremony tax.",
    },
    {
        step: "04",
        title: "Harden",
        description: "Observability, load tests, chaos drills. Boring on release day.",
    },
    {
        step: "05",
        title: "Hand-off or Stay",
        description: "Full docs and knowledge transfer — or stay for ongoing product work.",
    },
];

// Technologies grouped by category
const technologies = [
    {name: "Java", icon: java, category: "Languages"},
    {name: "TypeScript", icon: typescript, category: "Languages"},
    {name: "JavaScript", icon: creator, category: "Languages"},
    {name: "PHP", icon: laravel, category: "Languages"},
    {name: "Python", icon: creator, category: "Languages"},
    {name: "SQL", icon: postgresql, category: "Languages"},
    {name: "GraphQL", icon: backend, category: "Languages"},

    {name: "Angular", icon: angular, category: "Frontend"},
    {name: "React.js", icon: reactjs, category: "Frontend"},
    {name: "Next.js", icon: nextjs, category: "Frontend"},
    {name: "Tailwind CSS", icon: tailwind, category: "Frontend"},
    {name: "Redux / RxJS", icon: redux, category: "Frontend"},

    {name: "Node.js", icon: nodejs, category: "Backend"},
    {name: "Express.js", icon: nodejs, category: "Backend"},
    {name: "Spring Boot", icon: java, category: "Backend"},
    {name: "Spring Security", icon: java, category: "Backend"},
    {name: "Laravel / Lumen", icon: laravel, category: "Backend"},

    {name: "PostgreSQL", icon: postgresql, category: "Data"},
    {name: "MongoDB", icon: mongodb, category: "Data"},
    {name: "MySQL", icon: postgresql, category: "Data"},
    {name: "Redis", icon: backend, category: "Data"},
    {name: "CouchDB / RxDB", icon: mongodb, category: "Data"},
    {name: "Kafka / RabbitMQ", icon: backend, category: "Data"},

    {name: "AWS", icon: backend, category: "Cloud & DevOps"},
    {name: "Azure", icon: backend, category: "Cloud & DevOps"},
    {name: "Docker", icon: docker, category: "Cloud & DevOps"},
    {name: "Kubernetes", icon: docker, category: "Cloud & DevOps"},
    {name: "GitHub Actions", icon: git, category: "Cloud & DevOps"},
    {name: "Git", icon: git, category: "Cloud & DevOps"},

    {name: "LangChain", icon: creator, category: "AI & Integrations"},
    {name: "OpenAI API", icon: creator, category: "AI & Integrations"},
    {name: "Anthropic Claude", icon: creator, category: "AI & Integrations"},
    {name: "WebSocket", icon: backend, category: "AI & Integrations"},
];

// "Experience" repurposed as partners / studios we've engineered alongside
const experiences = [
    {
        title: "Principal Engineering Partner",
        company_name: "Elixir Technologies",
        companyMeta: "Enterprise Software · Remote",
        date: "Oct 2025 — Present",
        badge: {initials: "ET", gradient: "from-[#f97316] to-[#fb7185]"},
        iconBg: "#f97316",
        points: [
            "Design and ship scalable enterprise platforms that deliver measurable business value.",
            "Lead technical architecture decisions and enforce best practices across the SDLC.",
            "Mentor teams, run code reviews, raise the engineering-excellence bar.",
            "Architect robust systems with modern tools — rigorous automated testing, measurable performance.",
        ],
        stack: ["Java", "Spring Boot", "TypeScript", "Angular", "React", "PostgreSQL", "Docker", "Kubernetes"],
    },
    {
        title: "Senior Engineering Partner",
        company_name: "Cloudtek",
        companyMeta: "Enterprise Web · Hybrid",
        date: "Jun 2022 — Sep 2025",
        icon: cloudtek,
        iconBg: "#ffffff",
        points: [
            "Built complex enterprise web apps on Node.js, Angular, React, Spring Boot / Security, GraphQL, RxDB, PostgreSQL and CouchDB.",
            "Led a dev team — delivery, guidance, code training and rigorous PR review — across concurrent projects.",
            "Facilitated Scrum / Kanban / Agile ceremonies for efficient planning and delivery.",
            "Partnered with cross-functional teams to translate ambiguous problems into maintainable solutions.",
        ],
        stack: ["Node.js", "Angular", "React.js", "Spring Boot", "GraphQL", "RxDB", "PostgreSQL", "CouchDB"],
    },
    {
        title: "MEAN Stack Engineering",
        company_name: "AKSA-SDS",
        companyMeta: "Fintech & Banking · On-site",
        date: "Aug 2020 — May 2022",
        icon: aksaSds,
        iconBg: "#e6dedd",
        points: [
            "Built branchless-banking apps on the MEAN stack for EasyPaisa and JazzCash — Pakistan's largest mobile wallets.",
            "Designed microservices architecture to improve scalability and maintainability of the banking backbone.",
            "Shipped TPL Trakker maps with Leaflet.js — a FoodPanda-tuned alternative to Google Maps.",
            "Contributed to Zarai Taraqiati Bank Limited (ZTBL), an agricultural-banking platform on Angular.",
        ],
        stack: ["Angular", "Node.js", "MongoDB", "Leaflet.js", "Three.js", "Microservices"],
    },
    {
        title: "Product Engineering",
        company_name: "Deltashoppe",
        companyMeta: "Web Applications · On-site",
        date: "Mar 2017 — Aug 2020",
        icon: deltaShoppe,
        iconBg: "#ffffff",
        points: [
            "Built and maintained web applications on Laravel, Lumen and Blade — responsive, mobile-first UX.",
            "Optimized legacy MySQL schemas across millions of rows — meaningful latency drops, clean migrations.",
            "Integrated Google Maps into MySimpleRx, a pharmacy-coupon platform.",
            "Contributed early to branchless-banking microservices for EasyPaisa and JazzCash.",
        ],
        stack: ["PHP", "Laravel", "Lumen", "MySQL", "Blade", "Leaflet.js"],
    },
];

// === Client engagements / case studies ===
const projects = [
    {
        name: "EasyPaisa & JazzCash — Branchless Banking",
        company: "Fintech · Mobile Money",
        description:
            "Core flows for Pakistan's two largest mobile-money platforms — P2P transfers, bill pay, wallet top-ups and merchant settlements — on a microservice backbone. Hardened for regulatory audit, engineered for millions of subscribers.",
        metric: {label: "Active users", value: "10M+"},
        tags: [
            {name: "angular", color: "blue-text-gradient"},
            {name: "node.js", color: "green-text-gradient"},
            {name: "mongodb", color: "pink-text-gradient"},
            {name: "microservices", color: "blue-text-gradient"},
            {name: "fintech", color: "red-text-gradient"},
        ],
        coverArt: {from: "#a3e635", via: "#22d3ee", to: "#06070d", motif: "fintech"},
        motif3D: "coins",
        tint: "#22d3ee",
        live_link: null,
        source_code_link: null,
    },
    {
        name: "MySimpleRx",
        company: "Pharma · Consumer Health",
        description:
            "User-friendly pharmacy platform that simplifies medication management — secure prescription storage, refill requests and adherence tooling. Shipped end-to-end on Angular + Laravel with a PostgreSQL backbone.",
        tags: [
            {name: "angular", color: "blue-text-gradient"},
            {name: "laravel", color: "green-text-gradient"},
            {name: "postgresql", color: "pink-text-gradient"},
            {name: "lumen", color: "red-text-gradient"},
            {name: "microservices", color: "blue-text-gradient"},
        ],
        image: mysimplerx,
        motif3D: "pill",
        tint: "#fb7185",
        live_link: "https://mysimplerx.com",
        source_code_link: null,
    },
    {
        name: "VARS",
        company: "Finance · Analytics",
        description:
            "Analytics platform within MySimpleRx — insights, visualizations and trend detection so patients and providers can act on medication data. React + Angular frontends, Laravel/Lumen API.",
        tags: [
            {name: "react", color: "blue-text-gradient"},
            {name: "angular", color: "green-text-gradient"},
            {name: "laravel", color: "pink-text-gradient"},
            {name: "postgresql", color: "blue-text-gradient"},
            {name: "rest-api", color: "red-text-gradient"},
        ],
        image: vars,
        motif3D: "chart",
        tint: "#7c5cff",
        live_link: "https://vars.mysimplerx.com",
        source_code_link: null,
    },
    {
        name: "FlexiGolf",
        company: "Marketplace · Sports · Australia",
        description:
            "Tee-time booking marketplace for Australian golf courses — search availability, book slots, invite friends. Mobile-first UX, built to keep courses full and players moving.",
        tags: [
            {name: "react", color: "blue-text-gradient"},
            {name: "angular", color: "green-text-gradient"},
            {name: "laravel", color: "pink-text-gradient"},
            {name: "postgresql", color: "blue-text-gradient"},
            {name: "microservices", color: "red-text-gradient"},
        ],
        image: flexigolf,
        motif3D: "knot",
        tint: "#a3e635",
        live_link: "https://flexigolf.com.au",
        source_code_link: null,
    },
    {
        name: "Chotok",
        company: "Ticketing · Events",
        description:
            "Online ticket-booking platform for events and activities — browse experiences, purchase seamlessly, get to the event. Designed for speed, reliability and a clean checkout across devices.",
        tags: [
            {name: "react", color: "blue-text-gradient"},
            {name: "angular", color: "green-text-gradient"},
            {name: "laravel", color: "pink-text-gradient"},
            {name: "postgresql", color: "blue-text-gradient"},
            {name: "rest-api", color: "red-text-gradient"},
        ],
        image: chotok,
        motif3D: "ticket",
        tint: "#fb7185",
        live_link: "https://chotok.com",
        source_code_link: null,
    },
    {
        name: "UGAP",
        company: "Public Procurement · France",
        description:
            "Procurement portal for UGAP (Union des Groupements d'Achats Publics) — information hub and procurement platform for French public institutions, with contract discovery and advisory tooling.",
        tags: [
            {name: "laravel", color: "blue-text-gradient"},
            {name: "php", color: "green-text-gradient"},
            {name: "mysql", color: "pink-text-gradient"},
            {name: "html", color: "blue-text-gradient"},
            {name: "rest-api", color: "red-text-gradient"},
        ],
        image: ugap,
        motif3D: "pyramid",
        tint: "#7c5cff",
        live_link: "https://ugap.net",
        source_code_link: null,
    },
    {
        name: "EdFry",
        company: "Mentorship · Career Growth",
        description:
            "Mentorship-booking platform — scheduling, session management and profile surfaces for a professional-mentor marketplace. 1:1 sessions for software, design and career guidance.",
        tags: [
            {name: "react", color: "blue-text-gradient"},
            {name: "angular", color: "green-text-gradient"},
            {name: "laravel", color: "pink-text-gradient"},
            {name: "postgresql", color: "blue-text-gradient"},
            {name: "microservices", color: "red-text-gradient"},
        ],
        image: edfry,
        motif3D: "orbit",
        tint: "#22d3ee",
        live_link: "https://edfry.co",
        source_code_link: null,
    },
];

// === Testimonials — real client feedback ===
const testimonials = [
    {
        testimonial:
            "Dewelope's team shipped fast and shipped well. Delivered on time with a solid grip on the technical depth of the stack. Will be looking forward to hiring them again.",
        name: "Areeb Ali",
        designation: "Client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        testimonial:
            "Very fast, excellent delivery. A pleasure to work with — communicative throughout, no surprises. Highly recommended.",
        name: "SleeHom",
        designation: "Client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        testimonial:
            "Amazing delivery and before time! Kind, friendly and helpful throughout. Would order again.",
        name: "secretdoctor",
        designation: "Client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
        testimonial:
            "Made the right choice partnering with this team — thanks for the good work. Highly recommended.",
        name: "Lerthert",
        designation: "Client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        testimonial:
            "Wonderful experience. Work was done before time and the communication was clear throughout. Will engage again.",
        name: "Ali Imam",
        designation: "Client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
        testimonial:
            "Made my 3rd engagement with this team — consistent, friendly and always on point. Highly recommended.",
        name: "mrhazwansalam",
        designation: "Repeat client",
        company: "Fiverr",
        image: "https://randomuser.me/api/portraits/men/8.jpg",
    },
];

export {services, processSteps, technologies, experiences, testimonials, projects};
