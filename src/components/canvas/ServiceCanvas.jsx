import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {ContactShadows, Environment, Float, Lightformer} from "@react-three/drei";
import * as THREE from "three";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Compact studio rig — single warm key + subtle rims. Keeps cards calm.
const MiniStudio = () => (
    <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" rotation-x={Math.PI / 2} position={[0, 5, -2]} scale={[8, 8, 1]}/>
        <Lightformer form="rect" intensity={1.2} color="#cdd5ff" rotation-y={Math.PI / 2} position={[-4, 1, -2]} scale={[12, 2, 1]}/>
        <Lightformer form="rect" intensity={1.0} color="#e6eeff" rotation-y={-Math.PI / 2} position={[4, 1, -2]} scale={[12, 2, 1]}/>
        <Lightformer form="circle" intensity={0.7} color="#ffffff" position={[0, 1, 4]} scale={6}/>
    </Environment>
);

const chromeish = (color = "#dfe4f5") => ({
    color,
    metalness: 1,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.25,
});
const glossyPaint = (color) => ({
    color,
    metalness: 0.25,
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.1,
});

// ----------------------------------------------------------------
// STACK — layered platforms (Full-Stack)
// ----------------------------------------------------------------
const StackShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    const layers = useRef([]);
    const COUNT = 4;
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.3 * boost;
            group.current.rotation.x = -0.25;
        }
        layers.current.forEach((ref, i) => {
            if (!ref) return;
            ref.position.y = (i - (COUNT - 1) / 2) * 0.32 + Math.sin(t + i * 0.5) * 0.03;
        });
    });
    return (
        <group ref={group}>
            {Array.from({length: COUNT}).map((_, i) => (
                <mesh key={i} ref={(el) => (layers.current[i] = el)}>
                    <boxGeometry args={[1.2 - i * 0.1, 0.14, 1.2 - i * 0.1]}/>
                    <meshPhysicalMaterial {...chromeish(i % 2 ? "#a78bfa" : "#e8eaf2")}/>
                </mesh>
            ))}
        </group>
    );
};

// ----------------------------------------------------------------
// CLUSTER — microservices hub + nodes (Microservices)
// ----------------------------------------------------------------
const ClusterShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    const nodes = useRef([]);
    const positions = [
        [0.75, 0.5, 0.2],
        [-0.65, 0.45, -0.3],
        [0.55, -0.55, -0.3],
        [-0.55, -0.5, 0.3],
        [0, 0.85, -0.55],
    ];
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.25 * boost;
            group.current.rotation.x = Math.sin(t * 0.3) * 0.08;
        }
        nodes.current.forEach((ref, i) => {
            if (!ref) return;
            const p = positions[i];
            const d = Math.sin(t * 1.2 + i) * 0.06;
            ref.position.set(p[0] + d, p[1] - d, p[2]);
        });
    });
    return (
        <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.15} floatIntensity={0.4}>
            <group ref={group}>
                {/* Central hub */}
                <mesh>
                    <icosahedronGeometry args={[0.55, 0]}/>
                    <meshPhysicalMaterial {...chromeish("#cfd5ea")} flatShading/>
                </mesh>
                {/* Connector lines to nodes */}
                {positions.map((p, i) => {
                    const dir = new THREE.Vector3(...p);
                    const len = dir.length();
                    return (
                        <group key={`l-${i}`} position={[p[0] / 2, p[1] / 2, p[2] / 2]}>
                            <mesh lookAt={[p[0], p[1], p[2]]}>
                                <cylinderGeometry args={[0.008, 0.008, len, 8]}/>
                                <meshStandardMaterial color="#a78bfa" transparent opacity={0.55}/>
                            </mesh>
                        </group>
                    );
                })}
                {/* Nodes */}
                {positions.map((p, i) => (
                    <mesh key={`n-${i}`} ref={(el) => (nodes.current[i] = el)} position={p}>
                        <sphereGeometry args={[0.13, 20, 20]}/>
                        <meshPhysicalMaterial {...glossyPaint(i % 2 ? "#7c5cff" : "#22d3ee")}/>
                    </mesh>
                ))}
            </group>
        </Float>
    );
};

// ----------------------------------------------------------------
// VAULT — metallic cube with inset ring (Fintech)
// ----------------------------------------------------------------
const VaultShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    const knob = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.8 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.35 * boost;
            group.current.rotation.x = -0.18;
        }
        if (knob.current) knob.current.rotation.z = t * 0.9 * boost;
    });
    return (
        <Float speed={reduceMotion ? 0 : 0.9} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={group}>
                <mesh>
                    <boxGeometry args={[1.2, 1.2, 1.2]}/>
                    <meshPhysicalMaterial {...chromeish("#dfe4f5")}/>
                </mesh>
                {/* Inset ring on the front */}
                <mesh position={[0, 0, 0.61]}>
                    <torusGeometry args={[0.35, 0.04, 20, 48]}/>
                    <meshPhysicalMaterial {...chromeish("#f0c160")}/>
                </mesh>
                <mesh ref={knob} position={[0, 0, 0.64]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.06, 20]}/>
                    <meshPhysicalMaterial {...chromeish("#f0c160")}/>
                </mesh>
                {/* Bolt dots at corners */}
                {[
                    [-0.45, 0.45, 0.61],
                    [0.45, 0.45, 0.61],
                    [-0.45, -0.45, 0.61],
                    [0.45, -0.45, 0.61],
                ].map((p, i) => (
                    <mesh key={i} position={p}>
                        <sphereGeometry args={[0.04, 16, 16]}/>
                        <meshStandardMaterial color="#9fa6bb" metalness={1} roughness={0.4}/>
                    </mesh>
                ))}
            </group>
        </Float>
    );
};

// ----------------------------------------------------------------
// GEAR — torus with teeth (Modernization)
// ----------------------------------------------------------------
const GearShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    const teeth = 12;
    const teethRefs = useRef([]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.8 : 1;
        if (group.current) {
            group.current.rotation.z = t * 0.45 * boost;
            group.current.rotation.x = -0.1;
        }
    });
    return (
        <Float speed={reduceMotion ? 0 : 0.9} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={group}>
                <mesh>
                    <torusGeometry args={[0.62, 0.18, 20, 64]}/>
                    <meshPhysicalMaterial {...chromeish("#dfe4f5")}/>
                </mesh>
                {Array.from({length: teeth}).map((_, i) => {
                    const a = (i / teeth) * Math.PI * 2;
                    const r = 0.82;
                    return (
                        <mesh
                            key={i}
                            position={[Math.cos(a) * r, Math.sin(a) * r, 0]}
                            rotation={[0, 0, a]}
                            ref={(el) => (teethRefs.current[i] = el)}
                        >
                            <boxGeometry args={[0.16, 0.14, 0.22]}/>
                            <meshPhysicalMaterial {...chromeish("#cbd2e5")}/>
                        </mesh>
                    );
                })}
                {/* Center hole ring */}
                <mesh>
                    <torusGeometry args={[0.3, 0.03, 16, 48]}/>
                    <meshStandardMaterial color="#667099" metalness={1} roughness={0.5}/>
                </mesh>
            </group>
        </Float>
    );
};

// ----------------------------------------------------------------
// NEURAL — icosahedron + orbiting nodes (AI)
// ----------------------------------------------------------------
const NeuralShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    const sats = useRef([]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.3 * boost;
            group.current.rotation.x = Math.sin(t * 0.4) * 0.1;
        }
        sats.current.forEach((ref, i) => {
            if (!ref) return;
            const a = t * (0.7 + i * 0.25) * boost + i * 1.8;
            const r = 1.05 + (i % 2) * 0.15;
            ref.position.x = Math.cos(a) * r;
            ref.position.z = Math.sin(a) * r * 0.85;
            ref.position.y = Math.sin(a * 0.55) * 0.35;
        });
    });
    return (
        <Float speed={reduceMotion ? 0 : 1} rotationIntensity={0.14} floatIntensity={0.4}>
            <group ref={group}>
                <mesh>
                    <icosahedronGeometry args={[0.58, 0]}/>
                    <meshPhysicalMaterial {...chromeish("#a78bfa")} flatShading/>
                </mesh>
                {[0, 1, 2, 3].map((i) => {
                    const palette = ["#22d3ee", "#a3e635", "#fb7185", "#7c5cff"];
                    return (
                        <mesh key={i} ref={(el) => (sats.current[i] = el)}>
                            <sphereGeometry args={[0.11 - (i % 2) * 0.02, 20, 20]}/>
                            <meshPhysicalMaterial {...glossyPaint(palette[i])}/>
                        </mesh>
                    );
                })}
            </group>
        </Float>
    );
};

// ----------------------------------------------------------------
// HEX — hexagonal prism (Staff Aug)
// ----------------------------------------------------------------
const HexShape = ({reduceMotion, hoverRef}) => {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const boost = hoverRef.current ? 1.6 : 1;
        if (group.current) {
            group.current.rotation.y = t * 0.3 * boost;
            group.current.rotation.x = Math.sin(t * 0.3) * 0.12;
        }
    });
    return (
        <Float speed={reduceMotion ? 0 : 0.9} rotationIntensity={0.1} floatIntensity={0.35}>
            <group ref={group}>
                <mesh>
                    <cylinderGeometry args={[0.75, 0.75, 0.85, 6]}/>
                    <meshPhysicalMaterial {...chromeish("#dfe4f5")}/>
                </mesh>
                {/* Top cap ring */}
                <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.7, 0.02, 12, 8]}/>
                    <meshStandardMaterial color="#7c5cff" metalness={0.8} roughness={0.25}/>
                </mesh>
                {/* Subtle floating chip hovering above */}
                <mesh position={[0, 1.05, 0]}>
                    <boxGeometry args={[0.28, 0.06, 0.28]}/>
                    <meshPhysicalMaterial {...glossyPaint("#22d3ee")}/>
                </mesh>
            </group>
        </Float>
    );
};

const SHAPES = {
    stack: StackShape,
    cluster: ClusterShape,
    vault: VaultShape,
    gear: GearShape,
    neural: NeuralShape,
    hex: HexShape,
};

// ----------------------------------------------------------------
// Host canvas — IO-gated
// ----------------------------------------------------------------
const ServiceCanvas = ({shape = "stack", tint = "#7c5cff"}) => {
    const wrapRef = useRef(null);
    const hoverRef = useRef(false);
    const [inView, setInView] = useState(false);
    const [reduceMotion] = useState(prefersReducedMotion);

    const onPointerEnter = () => { hoverRef.current = true; };
    const onPointerLeave = () => { hoverRef.current = false; };

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "200px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    const Shape = SHAPES[shape] || StackShape;

    return (
        <div
            ref={wrapRef}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            className="relative w-full aspect-square"
            aria-hidden
        >
            {/* Transparent — lets the card surface show through, no visible border */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        `radial-gradient(circle at 50% 55%, ${tint}18, transparent 58%)`,
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
                        toneMapping: THREE.ACESFilmicToneMapping,
                        outputColorSpace: THREE.SRGBColorSpace,
                    }}
                    camera={{position: [0, 0.15, 3.2], fov: 38, near: 0.1, far: 30}}
                >
                    <Suspense fallback={null}>
                        <MiniStudio/>
                        <Shape reduceMotion={reduceMotion} hoverRef={hoverRef}/>
                        <ContactShadows position={[0, -1.05, 0]} opacity={0.45} blur={2.2} far={3} scale={4} color="#06070d"/>
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default ServiceCanvas;
