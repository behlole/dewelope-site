import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Float, TorusKnot, Icosahedron, Sphere, Torus} from "@react-three/drei";
import * as THREE from "three";

const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A cloud of additive-blended points scattered in a slab that fills the frame
const ParticleField = ({count = 1200, radius = 12}) => {
    const ref = useRef();
    const {positions, colors} = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const palette = [
            new THREE.Color("#7c5cff"),
            new THREE.Color("#22d3ee"),
            new THREE.Color("#a3e635"),
            new THREE.Color("#fb7185"),
        ];
        for (let i = 0; i < count; i++) {
            const r = Math.pow(Math.random(), 0.6) * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi) * 0.6;
            const c = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        return {positions, colors};
    }, [count, radius]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        ref.current.rotation.y = t * 0.02;
        ref.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3}/>
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                sizeAttenuation
                transparent
                opacity={0.9}
                vertexColors
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Scroll-linked core: torus knot with orbit rings, slowly drifts down and rotates
const DriftCore = ({scrollTargetRef, mouseRef, reduceMotion, mobile}) => {
    const group = useRef();
    const knot = useRef();
    const ring1 = useRef();
    const ring2 = useRef();
    const ring3 = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Pull current scroll progress from the DOM. Keeps this decoupled from React state
        // so we don't re-render the tree on every pixel of scroll.
        let progress = 0;
        if (typeof window !== "undefined") {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        }

        if (group.current) {
            // Drift the whole group downward and to the right as we scroll
            group.current.position.y = THREE.MathUtils.lerp(
                group.current.position.y,
                -progress * 6 + (mouseRef.current?.y || 0) * 0.4,
                0.08
            );
            group.current.position.x = THREE.MathUtils.lerp(
                group.current.position.x,
                progress * 2.5 + (mouseRef.current?.x || 0) * 0.6,
                0.08
            );
            group.current.rotation.y = t * 0.05 + progress * Math.PI * 1.2;
            group.current.rotation.x = Math.sin(t * 0.1) * 0.08 + progress * 0.25;
        }
        if (!reduceMotion && knot.current) {
            knot.current.rotation.x = t * 0.25;
            knot.current.rotation.y = t * 0.35;
        }
        if (ring1.current) ring1.current.rotation.z = t * 0.2;
        if (ring2.current) ring2.current.rotation.z = -t * 0.15;
        if (ring3.current) ring3.current.rotation.z = t * 0.1;
    });

    return (
        <group ref={group} position={[0, 0, 0]}>
            {/* halo */}
            <Sphere args={[3.4, 24, 24]}>
                <meshBasicMaterial color="#7c5cff" transparent opacity={0.04}/>
            </Sphere>

            {/* core knot */}
            <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.3} floatIntensity={0.9}>
                <TorusKnot ref={knot} args={[1.1, 0.28, mobile ? 140 : 220, mobile ? 18 : 28]}>
                    <meshStandardMaterial
                        color="#8b6bff"
                        emissive="#4c2dff"
                        emissiveIntensity={0.55}
                        roughness={0.25}
                        metalness={0.45}
                        flatShading
                    />
                </TorusKnot>
            </Float>

            {/* orbit rings */}
            <Torus ref={ring1} args={[2.4, 0.014, 16, 120]} rotation={[Math.PI / 2.2, 0, 0]}>
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.6} toneMapped={false}/>
            </Torus>
            <Torus ref={ring2} args={[2.9, 0.010, 16, 120]} rotation={[Math.PI / 1.7, Math.PI / 4, 0]}>
                <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.4} toneMapped={false}/>
            </Torus>
            <Torus ref={ring3} args={[3.35, 0.007, 16, 120]} rotation={[Math.PI / 2.8, Math.PI / 1.8, 0]}>
                <meshStandardMaterial color="#a3e635" emissive="#a3e635" emissiveIntensity={1.15} toneMapped={false}/>
            </Torus>

            {/* orbital shards */}
            {!mobile && (
                <>
                    <Icosahedron args={[0.14, 0]} position={[2.4, 0, 0]}>
                        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.1} toneMapped={false}/>
                    </Icosahedron>
                    <Icosahedron args={[0.11, 0]} position={[-2.6, 0.6, 0]}>
                        <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={1.1} toneMapped={false}/>
                    </Icosahedron>
                    <Icosahedron args={[0.08, 0]} position={[0, 2.9, -0.5]}>
                        <meshStandardMaterial color="#a3e635" emissive="#a3e635" emissiveIntensity={1.1} toneMapped={false}/>
                    </Icosahedron>
                </>
            )}
        </group>
    );
};

const BackgroundScene = () => {
    const wrapRef = useRef(null);
    const mouseRef = useRef({x: 0, y: 0});
    const [mobile] = useState(isMobile);
    const [reduceMotion] = useState(prefersReducedMotion);

    useEffect(() => {
        const onMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -((e.clientY / window.innerHeight) * 2 - 1),
            };
        };
        window.addEventListener("pointermove", onMove, {passive: true});
        return () => window.removeEventListener("pointermove", onMove);
    }, []);

    return (
        <div
            ref={wrapRef}
            aria-hidden
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
                // A very subtle gradient vignette that blends the 3D into the UI
                maskImage:
                    "radial-gradient(ellipse at 50% 35%, black 55%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.6) 100%)",
                WebkitMaskImage:
                    "radial-gradient(ellipse at 50% 35%, black 55%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.6) 100%)",
            }}
        >
            <Canvas
                shadows={false}
                frameloop={reduceMotion ? "demand" : "always"}
                dpr={mobile ? [1, 1.2] : [1, 1.6]}
                gl={{
                    antialias: !mobile,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                camera={{position: [0, 0, 9], fov: 32, near: 0.1, far: 200}}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.55}/>
                    <hemisphereLight color="#a78bfa" groundColor="#06070d" intensity={0.8}/>
                    <directionalLight position={[5, 5, 5]} intensity={1.6} color="#a78bfa"/>
                    <pointLight position={[-5, -3, -2]} intensity={1.2} color="#22d3ee"/>
                    <pointLight position={[5, -2, 3]} intensity={1.0} color="#fb7185"/>
                    {!mobile && <pointLight position={[0, 4, -4]} intensity={0.8} color="#7c5cff"/>}
                    <DriftCore mouseRef={mouseRef} reduceMotion={reduceMotion} mobile={mobile}/>
                    <ParticleField count={mobile ? 600 : 1200} radius={mobile ? 8 : 12}/>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default BackgroundScene;
