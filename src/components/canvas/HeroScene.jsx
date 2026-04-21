import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
    ContactShadows,
    Environment,
    Float,
    Icosahedron,
    Lightformer,
    MeshTransmissionMaterial,
    Torus,
    TorusKnot,
} from "@react-three/drei";
import * as THREE from "three";

const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ----------------------------------------------------------------
// Studio lighting — lightformer rig (no external HDR)
// ----------------------------------------------------------------
const Studio = () => (
    <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.5} color="#ffffff" rotation-x={Math.PI / 2} position={[0, 8, -3]} scale={[12, 12, 1]}/>
        <Lightformer form="rect" intensity={2.5} color="#22d3ee" rotation-y={Math.PI / 2} position={[-7, 1, -3]} scale={[30, 3, 1]}/>
        <Lightformer form="rect" intensity={2.3} color="#7c5cff" rotation-y={-Math.PI / 2} position={[7, 1, -3]} scale={[30, 3, 1]}/>
        <Lightformer form="circle" intensity={1.7} color="#fb7185" position={[0, 1, 7]} scale={8}/>
        <Lightformer form="rect" intensity={0.8} color="#a3e635" position={[0, 1, -8]} rotation-y={Math.PI} scale={[15, 4, 1]}/>
    </Environment>
);

// ----------------------------------------------------------------
// Particle field — volumetric dust motes
// ----------------------------------------------------------------
const ParticleField = ({count = 900, radius = 14}) => {
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
            const r = Math.pow(Math.random(), 0.55) * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi) * 0.7;
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
        ref.current.rotation.y = t * 0.022;
        ref.current.rotation.x = Math.sin(t * 0.05) * 0.08;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3}/>
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                sizeAttenuation
                transparent
                opacity={0.85}
                vertexColors
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// ----------------------------------------------------------------
// One orbit ring with satellites + traveling data pulse
// ----------------------------------------------------------------
const OrbitLayer = ({
    radius,
    tubeRadius = 0.012,
    rotation,
    color,
    speed = 0.15,
    satellites = 2,
    satelliteColor,
    pulseSpeed = 0.6,
    reverse = false,
    reduceMotion,
}) => {
    const ringRef = useRef();
    const satRefs = useRef([]);
    const pulseRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const dir = reverse ? -1 : 1;

        if (ringRef.current) {
            ringRef.current.rotation.z = t * speed * dir;
        }
        // Satellites distributed evenly around the ring
        satRefs.current.forEach((ref, i) => {
            if (!ref) return;
            const angle = t * speed * dir + (i / satellites) * Math.PI * 2;
            ref.position.x = Math.cos(angle) * radius;
            ref.position.z = Math.sin(angle) * radius;
            ref.rotation.x = t + i;
            ref.rotation.y = t * 0.7 + i;
        });
        // Pulse — a bright emissive bead traveling along the ring
        if (pulseRef.current) {
            const angle = t * pulseSpeed * dir + (reverse ? Math.PI : 0);
            pulseRef.current.position.x = Math.cos(angle) * radius;
            pulseRef.current.position.z = Math.sin(angle) * radius;
        }
    });

    return (
        <group rotation={rotation}>
            <Torus ref={ringRef} args={[radius, tubeRadius, 16, 140]}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.6}
                    toneMapped={false}
                />
            </Torus>

            {/* Satellite nodes */}
            {Array.from({length: satellites}).map((_, i) => (
                <mesh key={i} ref={(el) => (satRefs.current[i] = el)}>
                    <boxGeometry args={[0.12, 0.12, 0.12]}/>
                    <meshPhysicalMaterial
                        color={satelliteColor || color}
                        emissive={satelliteColor || color}
                        emissiveIntensity={0.6}
                        metalness={0.7}
                        roughness={0.18}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        envMapIntensity={1.3}
                    />
                </mesh>
            ))}

            {/* Traveling data pulse */}
            <mesh ref={pulseRef}>
                <sphereGeometry args={[0.055, 16, 16]}/>
                <meshBasicMaterial color={color} toneMapped={false}/>
            </mesh>
        </group>
    );
};

// ----------------------------------------------------------------
// Architecture core — glass platform surrounded by service rings
// ----------------------------------------------------------------
const ArchitectureCore = ({reduceMotion, mobile, mouseRef}) => {
    const group = useRef();
    const coreA = useRef();
    const coreB = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                t * 0.08 + (mouseRef.current?.x || 0) * 0.35,
                0.06
            );
            group.current.rotation.x = THREE.MathUtils.lerp(
                group.current.rotation.x,
                -0.12 - (mouseRef.current?.y || 0) * 0.25,
                0.06
            );
        }
        if (!reduceMotion) {
            if (coreA.current) {
                coreA.current.rotation.x = t * 0.25;
                coreA.current.rotation.y = t * 0.32;
            }
            if (coreB.current) {
                coreB.current.rotation.x = -t * 0.4;
                coreB.current.rotation.y = -t * 0.35;
            }
        }
    });

    return (
        <group ref={group}>
            {/* Soft ambient halo sphere */}
            <mesh>
                <sphereGeometry args={[3.5, 24, 24]}/>
                <meshBasicMaterial color="#7c5cff" transparent opacity={0.025}/>
            </mesh>

            {/* Central platform — glass icosahedron with internal wireframe shard */}
            <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.2} floatIntensity={0.7}>
                <group>
                    <mesh ref={coreA}>
                        <icosahedronGeometry args={[1.15, 0]}/>
                        <MeshTransmissionMaterial
                            backside
                            samples={mobile ? 3 : 6}
                            resolution={mobile ? 256 : 512}
                            transmission={1}
                            roughness={0.08}
                            thickness={1.2}
                            ior={1.45}
                            chromaticAberration={0.03}
                            distortion={0.18}
                            distortionScale={0.5}
                            temporalDistortion={0.1}
                            color="#a78bfa"
                            envMapIntensity={1.7}
                        />
                    </mesh>
                    {/* Inner glowing wireframe shard — reveals through the glass */}
                    <mesh ref={coreB}>
                        <icosahedronGeometry args={[0.62, 1]}/>
                        <meshBasicMaterial
                            color="#22d3ee"
                            wireframe
                            transparent
                            opacity={0.75}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            </Float>

            {/* Three service orbit layers — distinct angles and colors */}
            <OrbitLayer
                radius={2.0}
                tubeRadius={0.016}
                rotation={[Math.PI / 2.2, 0, 0]}
                color="#22d3ee"
                satelliteColor="#22d3ee"
                satellites={2}
                speed={0.25}
                pulseSpeed={0.9}
                reduceMotion={reduceMotion}
            />
            <OrbitLayer
                radius={2.5}
                tubeRadius={0.012}
                rotation={[Math.PI / 1.7, Math.PI / 4, 0]}
                color="#7c5cff"
                satelliteColor="#a78bfa"
                satellites={3}
                speed={0.18}
                pulseSpeed={0.75}
                reverse
                reduceMotion={reduceMotion}
            />
            <OrbitLayer
                radius={3.0}
                tubeRadius={0.01}
                rotation={[Math.PI / 2.8, Math.PI / 1.8, 0]}
                color="#a3e635"
                satelliteColor="#a3e635"
                satellites={2}
                speed={0.12}
                pulseSpeed={0.6}
                reduceMotion={reduceMotion}
            />

            {/* Subtle hexagonal grid floor — reads as an architectural plan */}
            {!mobile && (
                <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[4.5, 6]}/>
                    <meshStandardMaterial
                        color="#0b0d1a"
                        transparent
                        opacity={0.3}
                        metalness={0.8}
                        roughness={0.35}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
            <ContactShadows
                position={[0, -2.38, 0]}
                opacity={0.45}
                blur={3}
                far={5}
                scale={8}
                color="#06070d"
            />
        </group>
    );
};

// ----------------------------------------------------------------
// Camera rig — scroll-linked dolly + mouse parallax
// ----------------------------------------------------------------
const CameraRig = ({mouseRef}) => {
    const {camera} = useThree();
    const base = useRef({z: 9, y: 0.2});
    useFrame(() => {
        let p = 0;
        if (typeof window !== "undefined") {
            p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        }
        const targetZ = base.current.z + p * 2.5;
        const targetX = (mouseRef.current?.x || 0) * 0.7;
        const targetY = base.current.y - (mouseRef.current?.y || 0) * 0.45 - p * 0.7;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
        camera.lookAt(0, 0, 0);
    });
    return null;
};

// ----------------------------------------------------------------
// Host canvas
// ----------------------------------------------------------------
const HeroScene = () => {
    const wrapRef = useRef(null);
    const mouseRef = useRef({x: 0, y: 0});
    const [inView, setInView] = useState(true);
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

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "200px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={wrapRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
                maskImage:
                    "radial-gradient(ellipse at 50% 45%, black 55%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.35) 100%)",
                WebkitMaskImage:
                    "radial-gradient(ellipse at 50% 45%, black 55%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.35) 100%)",
            }}
        >
            <Canvas
                shadows={false}
                frameloop={inView && !reduceMotion ? "always" : "demand"}
                dpr={mobile ? [1, 1.2] : [1, 1.6]}
                gl={{
                    antialias: !mobile,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                camera={{position: [0, 0.2, 9], fov: 34, near: 0.1, far: 200}}
            >
                <Suspense fallback={null}>
                    <Studio/>
                    <CameraRig mouseRef={mouseRef}/>
                    <ArchitectureCore reduceMotion={reduceMotion} mobile={mobile} mouseRef={mouseRef}/>
                    <ParticleField count={mobile ? 450 : 900} radius={mobile ? 10 : 14}/>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroScene;
