import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Float} from "@react-three/drei";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================================================
// Motif scenes — each project gets a unique 3D composition
// ============================================================================

// COINS — stacked cylinders that rotate and shimmy (EasyPaisa / JazzCash)
const CoinsMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    const coins = useRef([]);
    const count = 5;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            const boost = hoverRef.current ? 1.6 : 1;
            group.current.rotation.y = t * 0.3 * boost;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.4;
            group.current.rotation.z = (mouseRef.current?.x || 0) * 0.2;
        }
        coins.current.forEach((ref, i) => {
            if (!ref) return;
            const phase = t * 1.2 + i * 0.8;
            ref.position.y = (i - (count - 1) / 2) * 0.35 + Math.sin(phase) * 0.08;
            ref.rotation.x = Math.PI / 2; // coins lie flat
            ref.rotation.z = t * 0.9 + i * 0.4;
        });
    });

    return (
        <group ref={group} position={[0, 0, 0]}>
            {Array.from({length: count}).map((_, i) => (
                <mesh key={i} ref={(el) => (coins.current[i] = el)}>
                    <cylinderGeometry args={[0.9 - i * 0.06, 0.9 - i * 0.06, 0.14, 48]}/>
                    <meshStandardMaterial
                        color={i % 2 === 0 ? "#a3e635" : "#22d3ee"}
                        emissive={i % 2 === 0 ? "#365314" : "#0e7490"}
                        emissiveIntensity={0.35}
                        metalness={0.75}
                        roughness={0.25}
                    />
                </mesh>
            ))}
        </group>
    );
};

// PILL — two-tone capsule floats and spins (MySimpleRx)
const PillMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (!group.current) return;
        const boost = hoverRef.current ? 1.8 : 1;
        group.current.rotation.x = t * 0.45 * boost + (mouseRef.current?.y || 0) * 0.4;
        group.current.rotation.y = t * 0.35 * boost + (mouseRef.current?.x || 0) * 0.5;
    });
    return (
        <Float speed={reduceMotion ? 0 : 1.2} rotationIntensity={0.2} floatIntensity={0.8}>
            <group ref={group} rotation={[0, 0, Math.PI / 6]}>
                {/* Top half */}
                <mesh position={[0, 0.4, 0]}>
                    <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}/>
                    <meshStandardMaterial color="#fb7185" roughness={0.25} metalness={0.2}/>
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.8, 32]}/>
                    <meshStandardMaterial color="#fb7185" roughness={0.25} metalness={0.2}/>
                </mesh>
                {/* Bottom half */}
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}/>
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.15}/>
                </mesh>
                <mesh position={[0, -0.4, 0]} visible={false}>
                    {/* offset guard */}
                </mesh>
                <mesh position={[0, -0.4, 0]}/>
            </group>
        </Float>
    );
};

// CHART — bouncing bars in a wave (VARS)
const ChartMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    const bars = useRef([]);
    const count = 6;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = (mouseRef.current?.x || 0) * 0.5 - t * 0.1;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.25;
        }
        bars.current.forEach((ref, i) => {
            if (!ref) return;
            const phase = t * 2 * boost + i * 0.5;
            const h = 0.5 + (Math.sin(phase) + 1) * 0.7;
            ref.scale.y = h;
            ref.position.y = (h - 1) * 0.5 - 0.3;
        });
    });

    return (
        <group ref={group}>
            {Array.from({length: count}).map((_, i) => {
                const x = (i - (count - 1) / 2) * 0.32;
                const c = i % 3 === 0 ? "#7c5cff" : i % 3 === 1 ? "#22d3ee" : "#a3e635";
                return (
                    <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[x, 0, 0]}>
                        <boxGeometry args={[0.22, 1, 0.22]}/>
                        <meshStandardMaterial
                            color={c}
                            emissive={c}
                            emissiveIntensity={0.4}
                            roughness={0.3}
                            metalness={0.45}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

// KNOT — torus knot with orbit dot (FlexiGolf)
const KnotMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    const sat = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.8 : 1;
        if (group.current) {
            group.current.rotation.x = t * 0.3 * boost + (mouseRef.current?.y || 0) * 0.3;
            group.current.rotation.y = t * 0.4 * boost + (mouseRef.current?.x || 0) * 0.4;
        }
        if (sat.current) {
            const r = 1.6;
            sat.current.position.x = Math.cos(t * 1.4) * r;
            sat.current.position.z = Math.sin(t * 1.4) * r;
            sat.current.position.y = Math.sin(t * 0.9) * 0.3;
        }
    });
    return (
        <Float speed={reduceMotion ? 0 : 1.0} rotationIntensity={0.2} floatIntensity={0.6}>
            <group ref={group}>
                <mesh>
                    <torusKnotGeometry args={[0.75, 0.22, 160, 24]}/>
                    <meshStandardMaterial
                        color="#a3e635"
                        emissive="#365314"
                        emissiveIntensity={0.3}
                        metalness={0.5}
                        roughness={0.28}
                        flatShading
                    />
                </mesh>
                <mesh ref={sat}>
                    <sphereGeometry args={[0.12, 16, 16]}/>
                    <meshStandardMaterial
                        color="#22d3ee"
                        emissive="#22d3ee"
                        emissiveIntensity={1.2}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </Float>
    );
};

// TICKET — floating rectangular card with tilt (Chotok)
const TicketMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.5 : 1;
        if (group.current) {
            group.current.rotation.y = Math.sin(t * 0.9 * boost) * 0.8 + (mouseRef.current?.x || 0) * 0.5;
            group.current.rotation.x = Math.sin(t * 0.6 * boost) * 0.35 + (mouseRef.current?.y || 0) * 0.3;
            group.current.position.y = Math.sin(t * 1.5) * 0.12;
        }
    });
    return (
        <Float speed={reduceMotion ? 0 : 1.5} rotationIntensity={0.3} floatIntensity={0.6}>
            <group ref={group}>
                {/* Main ticket body */}
                <mesh>
                    <boxGeometry args={[2.1, 1.2, 0.06]}/>
                    <meshStandardMaterial color="#fb7185" metalness={0.3} roughness={0.35}/>
                </mesh>
                {/* Perforation line hole */}
                {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
                    <mesh key={i} position={[x, 0.3, 0.04]}>
                        <circleGeometry args={[0.04, 16]}/>
                        <meshBasicMaterial color="#06070d"/>
                    </mesh>
                ))}
                {/* Color stripe */}
                <mesh position={[-0.75, 0, 0.04]}>
                    <planeGeometry args={[0.55, 1.2]}/>
                    <meshBasicMaterial color="#f97316"/>
                </mesh>
            </group>
        </Float>
    );
};

// PYRAMID — tetrahedron with orbiting cubes (UGAP)
const PyramidMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    const cubes = useRef([]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.25 * boost + (mouseRef.current?.x || 0) * 0.4;
            group.current.rotation.x = Math.sin(t * 0.4) * 0.1 + (mouseRef.current?.y || 0) * 0.25;
        }
        cubes.current.forEach((ref, i) => {
            if (!ref) return;
            const angle = t * 0.8 * boost + (i / 3) * Math.PI * 2;
            const r = 1.4;
            ref.position.x = Math.cos(angle) * r;
            ref.position.z = Math.sin(angle) * r;
            ref.position.y = Math.sin(t * 1.1 + i) * 0.25;
            ref.rotation.x = t + i;
            ref.rotation.y = t * 0.6 + i;
        });
    });
    return (
        <group ref={group}>
            <mesh>
                <tetrahedronGeometry args={[0.95, 0]}/>
                <meshStandardMaterial
                    color="#7c5cff"
                    emissive="#4338ca"
                    emissiveIntensity={0.4}
                    metalness={0.55}
                    roughness={0.3}
                    flatShading
                />
            </mesh>
            {[0, 1, 2].map((i) => (
                <mesh key={i} ref={(el) => (cubes.current[i] = el)}>
                    <boxGeometry args={[0.2, 0.2, 0.2]}/>
                    <meshStandardMaterial
                        color="#22d3ee"
                        emissive="#22d3ee"
                        emissiveIntensity={1.0}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

// ORBIT — central icosahedron with orbiting spheres (EdFry / mentorship)
const OrbitMotif = ({reduceMotion, mouseRef, hoverRef}) => {
    const group = useRef();
    const sats = useRef([]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.7 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.3 * boost + (mouseRef.current?.x || 0) * 0.4;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.3;
        }
        sats.current.forEach((ref, i) => {
            if (!ref) return;
            const a = t * (0.6 + i * 0.2) * boost + i * 1.4;
            const r = 1.2 + i * 0.3;
            ref.position.x = Math.cos(a) * r;
            ref.position.z = Math.sin(a) * r * 0.7;
            ref.position.y = Math.sin(a * 0.6) * 0.4 + (i - 1) * 0.2;
        });
    });
    return (
        <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.25} floatIntensity={0.6}>
            <group ref={group}>
                <mesh>
                    <icosahedronGeometry args={[0.6, 0]}/>
                    <meshStandardMaterial
                        color="#a78bfa"
                        emissive="#4c2dff"
                        emissiveIntensity={0.55}
                        metalness={0.45}
                        roughness={0.3}
                        flatShading
                    />
                </mesh>
                {[0, 1, 2].map((i) => {
                    const color = i === 0 ? "#22d3ee" : i === 1 ? "#a3e635" : "#fb7185";
                    return (
                        <mesh key={i} ref={(el) => (sats.current[i] = el)}>
                            <sphereGeometry args={[0.14 - i * 0.02, 16, 16]}/>
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={1.0}
                                toneMapped={false}
                            />
                        </mesh>
                    );
                })}
            </group>
        </Float>
    );
};

const MOTIFS = {
    coins: CoinsMotif,
    pill: PillMotif,
    chart: ChartMotif,
    knot: KnotMotif,
    ticket: TicketMotif,
    pyramid: PyramidMotif,
    orbit: OrbitMotif,
};

// ============================================================================
// Host canvas — IO-gated, mouse-aware
// ============================================================================

const ProjectCanvas = ({motif = "orbit", tint = "#7c5cff"}) => {
    const wrapRef = useRef(null);
    const mouseRef = useRef({x: 0, y: 0});
    const hoverRef = useRef(false);
    const [inView, setInView] = useState(false);
    const [reduceMotion] = useState(prefersReducedMotion);

    const onPointerMove = (e) => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mouseRef.current = {
            x: ((e.clientX - r.left) / r.width) * 2 - 1,
            y: -(((e.clientY - r.top) / r.height) * 2 - 1),
        };
    };
    const onPointerEnter = () => { hoverRef.current = true; };
    const onPointerLeave = () => {
        hoverRef.current = false;
        mouseRef.current = {x: 0, y: 0};
    };

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "200px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    const Motif = MOTIFS[motif] || OrbitMotif;

    return (
        <div
            ref={wrapRef}
            onPointerMove={onPointerMove}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            className="absolute inset-0"
            aria-hidden
        >
            {/* Color wash backdrop so the scene reads even before Canvas mounts */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 30% 25%, ${tint}33, transparent 55%),
                                 radial-gradient(circle at 70% 80%, ${tint}22, transparent 60%),
                                 linear-gradient(180deg, #0b0d1a 0%, #06070d 100%)`,
                }}
            />
            {inView && (
                <Canvas
                    shadows={false}
                    frameloop={reduceMotion ? "demand" : "always"}
                    dpr={[1, 1.5]}
                    gl={{antialias: true, alpha: true, powerPreference: "high-performance"}}
                    camera={{position: [0, 0, 4], fov: 38, near: 0.1, far: 50}}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.6}/>
                        <hemisphereLight color="#a78bfa" groundColor="#06070d" intensity={0.75}/>
                        <directionalLight position={[3, 4, 3]} intensity={1.5} color="#ffffff"/>
                        <pointLight position={[-3, -2, -1]} intensity={0.9} color="#22d3ee"/>
                        <pointLight position={[3, -1, 2]} intensity={0.7} color="#fb7185"/>
                        <Motif reduceMotion={reduceMotion} mouseRef={mouseRef} hoverRef={hoverRef}/>
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default ProjectCanvas;
