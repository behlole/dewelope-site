import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
    ContactShadows,
    Environment,
    Float,
    Lightformer,
    MeshTransmissionMaterial,
    Torus,
} from "@react-three/drei";
import * as THREE from "three";

const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Calm, mostly-white studio — soft violet rim, no saturated fills
const Studio = () => (
    <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} color="#ffffff" rotation-x={Math.PI / 2} position={[0, 8, -2]} scale={[12, 12, 1]}/>
        <Lightformer form="rect" intensity={1.4} color="#c9d1ff" rotation-y={Math.PI / 2} position={[-6, 1, -2]} scale={[24, 2, 1]}/>
        <Lightformer form="rect" intensity={1.2} color="#e6f4ff" rotation-y={-Math.PI / 2} position={[6, 1, -2]} scale={[24, 2, 1]}/>
        <Lightformer form="circle" intensity={0.9} color="#ffffff" position={[0, 2, 6]} scale={8}/>
    </Environment>
);

// Sparse dust — no color saturation, very faint
const ParticleField = ({count = 380, radius = 13}) => {
    const ref = useRef();
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = Math.pow(Math.random(), 0.6) * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi) * 0.75;
        }
        return p;
    }, [count, radius]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
            </bufferGeometry>
            <pointsMaterial
                size={0.022}
                sizeAttenuation
                transparent
                opacity={0.55}
                color="#cfd6ff"
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// One understated ring — no emissive boost, just proper material
const Ring = ({radius, tube = 0.008, rotation, color, speed = 0.1, reverse = false}) => {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        ref.current.rotation.z = t * speed * (reverse ? -1 : 1);
    });
    return (
        <group rotation={rotation}>
            <Torus ref={ref} args={[radius, tube, 12, 160]}>
                <meshStandardMaterial
                    color={color}
                    metalness={0.85}
                    roughness={0.25}
                    transparent
                    opacity={0.55}
                />
            </Torus>
        </group>
    );
};

// Quiet satellite — brushed metal sphere, slow orbit
const Satellite = ({radius, rotation, speed = 0.12, phase = 0, size = 0.13, color = "#d7def1"}) => {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime() * speed + phase;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
    });
    return (
        <group rotation={rotation}>
            <mesh ref={ref}>
                <sphereGeometry args={[size, 24, 24]}/>
                <meshPhysicalMaterial
                    color={color}
                    metalness={1}
                    roughness={0.22}
                    clearcoat={1}
                    clearcoatRoughness={0.08}
                    envMapIntensity={1.3}
                />
            </mesh>
        </group>
    );
};

// Central composition — soft glass form, calm, no neon
const Core = ({reduceMotion, mobile, mouseRef}) => {
    const group = useRef();
    const inner = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                t * 0.05 + (mouseRef.current?.x || 0) * 0.25,
                0.05
            );
            group.current.rotation.x = THREE.MathUtils.lerp(
                group.current.rotation.x,
                -0.08 - (mouseRef.current?.y || 0) * 0.18,
                0.05
            );
        }
        if (inner.current && !reduceMotion) {
            inner.current.rotation.x = t * 0.12;
            inner.current.rotation.y = t * 0.18;
        }
    });

    return (
        <group ref={group}>
            <Float speed={reduceMotion ? 0 : 0.8} rotationIntensity={0.12} floatIntensity={0.4}>
                <mesh>
                    <icosahedronGeometry args={[1.1, 0]}/>
                    <MeshTransmissionMaterial
                        backside
                        samples={mobile ? 3 : 5}
                        resolution={mobile ? 256 : 512}
                        transmission={1}
                        roughness={0.15}
                        thickness={0.9}
                        ior={1.4}
                        chromaticAberration={0.008}
                        distortion={0.06}
                        distortionScale={0.3}
                        temporalDistortion={0.03}
                        color="#e8eaf2"
                        envMapIntensity={1.1}
                    />
                </mesh>
                {/* Delicate inner shard — barely visible, gives depth */}
                <mesh ref={inner}>
                    <icosahedronGeometry args={[0.55, 1]}/>
                    <meshBasicMaterial
                        color="#a78bfa"
                        wireframe
                        transparent
                        opacity={0.35}
                    />
                </mesh>
            </Float>

            {/* Two calm rings + a couple of satellites */}
            <Ring radius={1.95} tube={0.008} rotation={[Math.PI / 2.2, 0, 0]} color="#a78bfa" speed={0.1}/>
            <Ring radius={2.55} tube={0.006} rotation={[Math.PI / 1.7, Math.PI / 4, 0]} color="#7f9bff" speed={0.08} reverse/>

            <Satellite radius={1.95} rotation={[Math.PI / 2.2, 0, 0]} speed={0.18} phase={0}/>
            <Satellite radius={2.55} rotation={[Math.PI / 1.7, Math.PI / 4, 0]} speed={-0.14} phase={1.8} size={0.1}/>

            <ContactShadows position={[0, -1.9, 0]} opacity={0.35} blur={3.2} far={5} scale={8} color="#06070d"/>
        </group>
    );
};

const CameraRig = ({mouseRef}) => {
    const {camera} = useThree();
    const base = useRef({z: 9, y: 0.15});
    useFrame(() => {
        let p = 0;
        if (typeof window !== "undefined") {
            p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        }
        const targetZ = base.current.z + p * 1.8;
        const targetX = (mouseRef.current?.x || 0) * 0.4;
        const targetY = base.current.y - (mouseRef.current?.y || 0) * 0.25 - p * 0.5;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
        camera.lookAt(0, 0, 0);
    });
    return null;
};

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
                    "radial-gradient(ellipse at 50% 45%, black 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.2) 100%)",
                WebkitMaskImage:
                    "radial-gradient(ellipse at 50% 45%, black 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.2) 100%)",
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
                camera={{position: [0, 0.15, 9], fov: 32, near: 0.1, far: 200}}
            >
                <Suspense fallback={null}>
                    <Studio/>
                    <CameraRig mouseRef={mouseRef}/>
                    <Core reduceMotion={reduceMotion} mobile={mobile} mouseRef={mouseRef}/>
                    <ParticleField count={mobile ? 200 : 380} radius={mobile ? 10 : 13}/>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroScene;
