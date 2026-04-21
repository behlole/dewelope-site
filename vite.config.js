import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        target: "es2020",
        cssCodeSplit: true,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                // Only split out the truly heavy isolated libs.
                // React + react-dom + react-router and any lib that consumes
                // them (react-vertical-timeline, use-sync-external-store) stay
                // in the main bundle so default-export interop is correct
                // across chunks. Splitting React causes
                // `Cannot read properties of undefined (reading 'useLayoutEffect')`.
                manualChunks: (id) => {
                    if (!id.includes("node_modules")) return;
                    // Keep three core and @react-three in one chunk — drei
                    // re-exports types from @react-three/fiber so splitting
                    // across chunks breaks interop.
                    if (id.includes("three") || id.includes("@react-three")) return "vendor-three";
                    if (id.includes("framer-motion")) return "vendor-motion";
                    if (id.includes("react-icons")) return "vendor-icons";
                    if (id.includes("lenis")) return "vendor-lenis";
                    if (id.includes("@emailjs")) return "vendor-email";
                    if (id.includes("react-vertical-timeline")) return "vendor-timeline";
                    // Everything else (React, react-dom, react-router,
                    // helpers, etc) stays in main to preserve default-export
                    // interop across chunks.
                    return undefined;
                },
            },
        },
    },
    server: {
        host: true,
    },
});
