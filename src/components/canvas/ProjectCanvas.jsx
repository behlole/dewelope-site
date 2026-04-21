import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {ContactShadows, Environment, Float, Lightformer, MeshTransmissionMaterial} from "@react-three/drei";
import * as THREE from "three";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Shared studio env + materials helpers ----------
const Studio = () => (
    <Environment resolution={128} frames={1}>
        {/* Key light above */}
        <Lightformer form="rect" intensity={3.5} color="#ffffff" rotation-x={Math.PI / 2} position={[0, 6, -2]} scale={[8, 8, 1]}/>
        {/* Cyan rim left */}
        <Lightformer form="rect" intensity={2.5} color="#22d3ee" rotation-y={Math.PI / 2} position={[-5, 1, -2]} scale={[20, 2, 1]}/>
        {/* Violet rim right */}
        <Lightformer form="rect" intensity={2.2} color="#7c5cff" rotation-y={-Math.PI / 2} position={[5, 1, -2]} scale={[20, 2, 1]}/>
        {/* Warm fill front */}
        <Lightformer form="circle" intensity={1.6} color="#fb7185" position={[0, 1, 5]} scale={6}/>
        {/* Ambient base */}
        <Lightformer form="rect" intensity={0.6} color="#e8eaf2" position={[0, -4, 0]} scale={[20, 20, 1]} rotation-x={-Math.PI / 2}/>
    </Environment>
);

// Burst controller — shared "click burst" scale factor (1.0 idle → ~1.25 on click, relaxes)
const useBurst = (burstTrigger) => {
    const burst = useRef(0);
    useFrame(() => {
        // Decay the burst energy each frame
        burst.current = THREE.MathUtils.lerp(burst.current, 0, 0.06);
    });
    // Trigger externally
    useEffect(() => {
        if (!burstTrigger) return;
        const handler = () => { burst.current = 1; };
        burstTrigger.current = handler;
    }, [burstTrigger]);
    return burst;
};

// ----------------------------------------------------------------
// COINS — spinning stack of beveled coins (EasyPaisa / JazzCash)
// ----------------------------------------------------------------
const CoinsMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const coins = useRef([]);
    const burst = useBurst(burstTrigger);
    const COUNT = 6;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 2 : 1;

        if (group.current) {
            group.current.rotation.y = t * 0.28 * boost;
            group.current.rotation.x = THREE.MathUtils.lerp(
                group.current.rotation.x,
                -0.25 + (mouseRef.current?.y || 0) * 0.35,
                0.1
            );
            group.current.rotation.z = THREE.MathUtils.lerp(
                group.current.rotation.z,
                (mouseRef.current?.x || 0) * 0.18,
                0.1
            );
        }
        coins.current.forEach((ref, i) => {
            if (!ref) return;
            const idle = Math.sin(t * 1.1 + i * 0.6) * 0.04;
            const spread = burst.current * 0.6;
            ref.position.y = (i - (COUNT - 1) / 2) * 0.28 + idle + (i - (COUNT - 1) / 2) * spread;
            ref.rotation.y = t * (0.4 + i * 0.05) + i * 0.4;
        });
    });

    return (
        <>
            <group ref={group} position={[0, 0.1, 0]}>
                {Array.from({length: COUNT}).map((_, i) => {
                    const isGold = i % 2 === 0;
                    return (
                        <group key={i} ref={(el) => (coins.current[i] = el)}>
                            {/* Face */}
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.85 - i * 0.02, 0.85 - i * 0.02, 0.1, 64, 1, false]}/>
                                <meshPhysicalMaterial
                                    color={isGold ? "#f0c160" : "#cfe8ff"}
                                    metalness={1}
                                    roughness={0.18}
                                    clearcoat={1}
                                    clearcoatRoughness={0.1}
                                    envMapIntensity={1.4}
                                />
                            </mesh>
                            {/* Engraved ring */}
                            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
                                <torusGeometry args={[0.62 - i * 0.02, 0.012, 16, 72]}/>
                                <meshStandardMaterial
                                    color={isGold ? "#9a6a1e" : "#5f8db3"}
                                    metalness={1}
                                    roughness={0.35}
                                />
                            </mesh>
                        </group>
                    );
                })}
            </group>
            <ContactShadows position={[0, -1.15, 0]} opacity={0.55} blur={2.4} far={4} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// PILL — glossy two-tone capsule (MySimpleRx)
// ----------------------------------------------------------------
const PillMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const body = useRef();
    const burst = useBurst(burstTrigger);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.7 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.45 * boost + (mouseRef.current?.x || 0) * 0.5;
            group.current.rotation.x = t * 0.25 * boost + (mouseRef.current?.y || 0) * 0.35;
            group.current.rotation.z = Math.PI / 8;
        }
        if (body.current) {
            const s = 1 + burst.current * 0.08;
            body.current.scale.set(s, s, s);
        }
    });

    return (
        <>
            <Float speed={reduceMotion ? 0 : 1.2} rotationIntensity={0.2} floatIntensity={0.8}>
                <group ref={group}>
                    <group ref={body}>
                        {/* Top half (pink) */}
                        <mesh position={[0, 0.55, 0]}>
                            <sphereGeometry args={[0.68, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]}/>
                            <meshPhysicalMaterial
                                color="#fb7185"
                                metalness={0.15}
                                roughness={0.28}
                                clearcoat={1}
                                clearcoatRoughness={0.08}
                                sheen={0.5}
                                sheenColor="#ffd1d8"
                                envMapIntensity={1.2}
                            />
                        </mesh>
                        <mesh position={[0, 0.275, 0]}>
                            <cylinderGeometry args={[0.68, 0.68, 0.55, 48, 1, true]}/>
                            <meshPhysicalMaterial
                                color="#fb7185"
                                metalness={0.15}
                                roughness={0.28}
                                clearcoat={1}
                                clearcoatRoughness={0.08}
                                sheen={0.5}
                                sheenColor="#ffd1d8"
                                envMapIntensity={1.2}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        {/* Bottom half (white) */}
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[0.68, 0.68, 0.55, 48, 1, true]}/>
                            <meshPhysicalMaterial
                                color="#f8fafc"
                                metalness={0.05}
                                roughness={0.35}
                                clearcoat={1}
                                clearcoatRoughness={0.12}
                                envMapIntensity={1}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        <mesh position={[0, -0.275, 0]} rotation={[Math.PI, 0, 0]}>
                            <sphereGeometry args={[0.68, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]}/>
                            <meshPhysicalMaterial
                                color="#f8fafc"
                                metalness={0.05}
                                roughness={0.35}
                                clearcoat={1}
                                clearcoatRoughness={0.12}
                                envMapIntensity={1}
                            />
                        </mesh>
                        {/* Seam ring */}
                        <mesh position={[0, 0.275, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.681, 0.008, 10, 72]}/>
                            <meshStandardMaterial color="#642a2f" metalness={0.1} roughness={0.7}/>
                        </mesh>
                    </group>
                </group>
            </Float>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} blur={2.4} far={4} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// CHART — frosted glass bars on a plate (VARS)
// ----------------------------------------------------------------
const ChartMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const bars = useRef([]);
    const burst = useBurst(burstTrigger);
    const COUNT = 6;
    // Pre-computed baseline heights that read as a story (up-down-up)
    const heights = [0.55, 0.75, 0.95, 0.8, 1.1, 1.4];

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                -0.35 + (mouseRef.current?.x || 0) * 0.5,
                0.08
            );
            group.current.rotation.x = THREE.MathUtils.lerp(
                group.current.rotation.x,
                -0.25 + (mouseRef.current?.y || 0) * 0.3,
                0.08
            );
        }
        bars.current.forEach((ref, i) => {
            if (!ref) return;
            const base = heights[i];
            const wobble = Math.sin(t * 1.8 * boost + i * 0.6) * 0.08;
            const h = base + wobble + burst.current * 0.4;
            ref.scale.y = h;
            ref.position.y = (h / 2) - 0.8;
        });
    });

    return (
        <>
            <group ref={group} position={[0, 0, 0]}>
                {/* Plate */}
                <mesh position={[0, -0.82, 0]} receiveShadow>
                    <boxGeometry args={[2.6, 0.04, 1.2]}/>
                    <meshPhysicalMaterial color="#1a1d33" metalness={0.5} roughness={0.35} clearcoat={1} clearcoatRoughness={0.3}/>
                </mesh>
                {Array.from({length: COUNT}).map((_, i) => {
                    const x = (i - (COUNT - 1) / 2) * 0.38;
                    const palette = ["#7c5cff", "#22d3ee", "#a3e635", "#fb7185", "#7c5cff", "#22d3ee"];
                    const c = palette[i];
                    return (
                        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[x, 0, 0]}>
                            <boxGeometry args={[0.26, 1, 0.26]}/>
                            <meshPhysicalMaterial
                                color={c}
                                emissive={c}
                                emissiveIntensity={0.15}
                                metalness={0.3}
                                roughness={0.15}
                                clearcoat={1}
                                clearcoatRoughness={0.08}
                                transmission={0.2}
                                thickness={0.4}
                                ior={1.4}
                                envMapIntensity={1.2}
                            />
                        </mesh>
                    );
                })}
            </group>
            <ContactShadows position={[0, -0.82, 0]} opacity={0.6} blur={2} far={3} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// KNOT — chrome torus knot with orbiting gem (FlexiGolf)
// ----------------------------------------------------------------
const KnotMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const knot = useRef();
    const sat = useRef();
    const burst = useBurst(burstTrigger);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.8 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.2 + (mouseRef.current?.x || 0) * 0.5;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.3;
        }
        if (knot.current) {
            knot.current.rotation.x = t * 0.3 * boost;
            knot.current.rotation.y = t * 0.45 * boost;
            const s = 1 + burst.current * 0.1;
            knot.current.scale.set(s, s, s);
        }
        if (sat.current) {
            const r = 1.6;
            sat.current.position.x = Math.cos(t * 1.3 * boost) * r;
            sat.current.position.z = Math.sin(t * 1.3 * boost) * r;
            sat.current.position.y = Math.sin(t * 0.9) * 0.35;
        }
    });

    return (
        <>
            <Float speed={reduceMotion ? 0 : 1.0} rotationIntensity={0.15} floatIntensity={0.5}>
                <group ref={group}>
                    <mesh ref={knot}>
                        <torusKnotGeometry args={[0.72, 0.22, 240, 32]}/>
                        <meshPhysicalMaterial
                            color="#e8eaf2"
                            metalness={1}
                            roughness={0.1}
                            clearcoat={1}
                            clearcoatRoughness={0.05}
                            envMapIntensity={1.6}
                        />
                    </mesh>
                    <mesh ref={sat}>
                        <icosahedronGeometry args={[0.14, 1]}/>
                        <meshPhysicalMaterial
                            color="#a3e635"
                            emissive="#a3e635"
                            emissiveIntensity={0.6}
                            metalness={0.6}
                            roughness={0.15}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                            envMapIntensity={1.3}
                        />
                    </mesh>
                </group>
            </Float>
            <ContactShadows position={[0, -1.1, 0]} opacity={0.5} blur={2.2} far={4} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// TICKET — rounded embossed ticket (Chotok)
// ----------------------------------------------------------------
const TicketMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const card = useRef();
    const burst = useBurst(burstTrigger);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.4 : 1;
        if (group.current) {
            group.current.rotation.y = Math.sin(t * 0.7 * boost) * 0.9 + (mouseRef.current?.x || 0) * 0.4;
            group.current.rotation.x = Math.sin(t * 0.5 * boost) * 0.28 + (mouseRef.current?.y || 0) * 0.25;
            group.current.position.y = Math.sin(t * 1.3) * 0.1;
        }
        if (card.current) {
            const s = 1 + burst.current * 0.08;
            card.current.scale.set(s, s, s);
        }
    });

    // Rounded rectangle via RoundedBox-equivalent (approx with scaled extruded shape)
    return (
        <>
            <Float speed={reduceMotion ? 0 : 1.3} rotationIntensity={0.2} floatIntensity={0.5}>
                <group ref={group}>
                    <group ref={card}>
                        {/* Body */}
                        <mesh>
                            <boxGeometry args={[2.2, 1.25, 0.08]}/>
                            <meshPhysicalMaterial
                                color="#fb7185"
                                metalness={0.25}
                                roughness={0.3}
                                clearcoat={1}
                                clearcoatRoughness={0.08}
                                envMapIntensity={1.3}
                            />
                        </mesh>
                        {/* Color stub */}
                        <mesh position={[-0.76, 0, 0.045]}>
                            <planeGeometry args={[0.56, 1.25]}/>
                            <meshPhysicalMaterial
                                color="#f97316"
                                metalness={0.4}
                                roughness={0.25}
                                clearcoat={1}
                                clearcoatRoughness={0.08}
                            />
                        </mesh>
                        {/* Perforation line */}
                        <mesh position={[-0.48, 0, 0.045]}>
                            <planeGeometry args={[0.01, 1.1]}/>
                            <meshBasicMaterial color="#2a1a0d"/>
                        </mesh>
                        {[-0.48].map((x) =>
                            [-0.45, -0.25, -0.05, 0.15, 0.35].map((y, k) => (
                                <mesh key={`p-${k}`} position={[x, y, 0.046]}>
                                    <circleGeometry args={[0.035, 16]}/>
                                    <meshBasicMaterial color="#06070d"/>
                                </mesh>
                            ))
                        )}
                        {/* Embossed bars (ticket number area) */}
                        {[-0.1, 0, 0.1].map((y, k) => (
                            <mesh key={`b-${k}`} position={[0.35, y, 0.046]}>
                                <boxGeometry args={[0.9, 0.04, 0.02]}/>
                                <meshStandardMaterial color="#ffd7d7" metalness={0.6} roughness={0.2}/>
                            </mesh>
                        ))}
                        {/* Back face polish */}
                        <mesh position={[0, 0, -0.041]}>
                            <planeGeometry args={[2.2, 1.25]}/>
                            <meshPhysicalMaterial
                                color="#c8515f"
                                metalness={0.3}
                                roughness={0.4}
                                clearcoat={0.8}
                                side={THREE.BackSide}
                            />
                        </mesh>
                    </group>
                </group>
            </Float>
            <ContactShadows position={[0, -0.95, 0]} opacity={0.5} blur={2.4} far={4} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// PYRAMID — metallic tetrahedron with orbiting cubes on a ring (UGAP)
// ----------------------------------------------------------------
const PyramidMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const tet = useRef();
    const ring = useRef();
    const cubes = useRef([]);
    const burst = useBurst(burstTrigger);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.5 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.2 + (mouseRef.current?.x || 0) * 0.4;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.25;
        }
        if (tet.current) {
            tet.current.rotation.y = -t * 0.35 * boost;
            tet.current.rotation.x = Math.sin(t * 0.4) * 0.15;
            const s = 1 + burst.current * 0.1;
            tet.current.scale.set(s, s, s);
        }
        if (ring.current) ring.current.rotation.z = t * 0.25 * boost;
        cubes.current.forEach((ref, i) => {
            if (!ref) return;
            const a = t * 0.9 * boost + (i / 3) * Math.PI * 2;
            const r = 1.4;
            ref.position.x = Math.cos(a) * r;
            ref.position.z = Math.sin(a) * r;
            ref.position.y = Math.sin(t * 1.2 + i) * 0.18;
            ref.rotation.x = t + i;
            ref.rotation.y = t * 0.7 + i;
        });
    });

    return (
        <>
            <group ref={group}>
                {/* Orbit ring */}
                <mesh ref={ring} rotation={[Math.PI / 2.3, 0, 0]}>
                    <torusGeometry args={[1.4, 0.02, 20, 120]}/>
                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.6} toneMapped={false}/>
                </mesh>
                {/* Tetrahedron */}
                <mesh ref={tet}>
                    <tetrahedronGeometry args={[0.95, 0]}/>
                    <meshPhysicalMaterial
                        color="#8b6bff"
                        metalness={1}
                        roughness={0.2}
                        clearcoat={1}
                        clearcoatRoughness={0.08}
                        envMapIntensity={1.4}
                        flatShading
                    />
                </mesh>
                {/* Orbiting cubes */}
                {[0, 1, 2].map((i) => (
                    <mesh key={i} ref={(el) => (cubes.current[i] = el)}>
                        <boxGeometry args={[0.2, 0.2, 0.2]}/>
                        <meshPhysicalMaterial
                            color="#22d3ee"
                            emissive="#22d3ee"
                            emissiveIntensity={0.7}
                            metalness={0.5}
                            roughness={0.18}
                            clearcoat={1}
                            envMapIntensity={1.4}
                        />
                    </mesh>
                ))}
            </group>
            <ContactShadows position={[0, -1.1, 0]} opacity={0.5} blur={2.2} far={4} scale={5} color="#06070d"/>
        </>
    );
};

// ----------------------------------------------------------------
// ORBIT — glass icosahedron with orbiting learners (EdFry)
// ----------------------------------------------------------------
const OrbitMotif = ({reduceMotion, mouseRef, hoverRef, burstTrigger}) => {
    const group = useRef();
    const core = useRef();
    const sats = useRef([]);
    const burst = useBurst(burstTrigger);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.28 * boost + (mouseRef.current?.x || 0) * 0.4;
            group.current.rotation.x = (mouseRef.current?.y || 0) * 0.3;
        }
        if (core.current) {
            core.current.rotation.x = t * 0.25;
            core.current.rotation.y = t * 0.35;
            const s = 1 + burst.current * 0.1;
            core.current.scale.set(s, s, s);
        }
        sats.current.forEach((ref, i) => {
            if (!ref) return;
            const a = t * (0.6 + i * 0.2) * boost + i * 1.4;
            const r = 1.2 + i * 0.3;
            ref.position.x = Math.cos(a) * r;
            ref.position.z = Math.sin(a) * r * 0.75;
            ref.position.y = Math.sin(a * 0.6) * 0.4 + (i - 1) * 0.2;
        });
    });

    return (
        <>
            <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.18} floatIntensity={0.5}>
                <group ref={group}>
                    <mesh ref={core}>
                        <icosahedronGeometry args={[0.62, 0]}/>
                        <MeshTransmissionMaterial
                            backside
                            samples={4}
                            resolution={256}
                            transmission={1}
                            roughness={0.08}
                            thickness={0.8}
                            ior={1.4}
                            chromaticAberration={0.02}
                            distortion={0.15}
                            temporalDistortion={0.1}
                            color="#a78bfa"
                            envMapIntensity={1.5}
                        />
                    </mesh>
                    {[0, 1, 2].map((i) => {
                        const palette = ["#22d3ee", "#a3e635", "#fb7185"];
                        const color = palette[i];
                        return (
                            <mesh key={i} ref={(el) => (sats.current[i] = el)}>
                                <sphereGeometry args={[0.15 - i * 0.02, 24, 24]}/>
                                <meshPhysicalMaterial
                                    color={color}
                                    emissive={color}
                                    emissiveIntensity={0.6}
                                    metalness={0.4}
                                    roughness={0.15}
                                    clearcoat={1}
                                    clearcoatRoughness={0.1}
                                    envMapIntensity={1.4}
                                />
                            </mesh>
                        );
                    })}
                </group>
            </Float>
            <ContactShadows position={[0, -1.1, 0]} opacity={0.55} blur={2.4} far={4} scale={5} color="#06070d"/>
        </>
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

// ----------------------------------------------------------------
// Host canvas — IO-gated, mouse + click-interact
// ----------------------------------------------------------------

const ProjectCanvas = ({motif = "orbit", tint = "#7c5cff"}) => {
    const wrapRef = useRef(null);
    const mouseRef = useRef({x: 0, y: 0});
    const hoverRef = useRef(false);
    const burstTrigger = useRef(null);
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
    const onPointerDown = (e) => {
        // Don't swallow click for card open; just kick the burst.
        if (burstTrigger.current) burstTrigger.current();
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
            onPointerDown={onPointerDown}
            className="absolute inset-0"
            aria-hidden
        >
            {/* Studio backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        `radial-gradient(circle at 30% 20%, ${tint}33, transparent 55%),
                         radial-gradient(circle at 75% 85%, ${tint}22, transparent 60%),
                         linear-gradient(180deg, #0b0d1a 0%, #06070d 100%)`,
                }}
            />
            {inView && (
                <Canvas
                    shadows={false}
                    frameloop={reduceMotion ? "demand" : "always"}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance",
                        toneMapping: THREE.ACESFilmicToneMapping,
                        outputColorSpace: THREE.SRGBColorSpace,
                    }}
                    camera={{position: [0, 0.1, 4], fov: 38, near: 0.1, far: 50}}
                >
                    <Suspense fallback={null}>
                        <Studio/>
                        <Motif
                            reduceMotion={reduceMotion}
                            mouseRef={mouseRef}
                            hoverRef={hoverRef}
                            burstTrigger={burstTrigger}
                        />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default ProjectCanvas;
