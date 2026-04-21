import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {
    Float,
    OrbitControls,
    Sphere,
    Torus,
    TorusKnot,
    Icosahedron,
} from "@react-three/drei";
import CanvasLoader from "../Loader.jsx";

const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small floating satellite that orbits the origin on its own inclined plane.
const Satellite = ({radius, speed, phase, tilt, size, color, shape = "ico"}) => {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed + phase;
        const x = Math.cos(t) * radius;
        const z = Math.sin(t) * radius;
        if (ref.current) {
            ref.current.position.set(x, Math.sin(t * 0.6) * 0.4, z);
            ref.current.rotation.x = t;
            ref.current.rotation.y = t * 0.8;
        }
    });
    return (
        <group rotation={[tilt, 0, 0]}>
            <group ref={ref}>
                {shape === "ico" ? (
                    <Icosahedron args={[size, 0]}>
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.9}
                            roughness={0.3}
                            metalness={0.5}
                            flatShading
                            toneMapped={false}
                        />
                    </Icosahedron>
                ) : (
                    <Sphere args={[size, 12, 12]}>
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={1.0}
                            roughness={0.4}
                            metalness={0.2}
                            toneMapped={false}
                        />
                    </Sphere>
                )}
            </group>
        </group>
    );
};

const Core = ({reduceMotion, mobile}) => {
    const knotRef = useRef();
    const aura1 = useRef();
    const aura2 = useRef();

    useFrame((state) => {
        if (reduceMotion) return;
        const t = state.clock.getElapsedTime();
        if (knotRef.current) {
            knotRef.current.rotation.x = t * 0.25;
            knotRef.current.rotation.y = t * 0.35;
        }
        if (aura1.current) aura1.current.rotation.z = t * 0.2;
        if (aura2.current) aura2.current.rotation.z = -t * 0.15;
    });

    return (
        <group>
            <Sphere args={[2.6, 24, 24]}>
                <meshBasicMaterial color="#7c5cff" transparent opacity={0.035}/>
            </Sphere>

            <Float speed={reduceMotion ? 0 : 1.2} rotationIntensity={0.3} floatIntensity={0.8}>
                <TorusKnot ref={knotRef} args={[0.95, 0.22, mobile ? 120 : 200, mobile ? 16 : 24]}>
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

            <Torus ref={aura1} args={[2.05, 0.012, 16, 96]} rotation={[Math.PI / 2.2, 0, 0]}>
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={1.6}
                    toneMapped={false}
                />
            </Torus>
            <Torus ref={aura2} args={[2.45, 0.008, 16, 96]} rotation={[Math.PI / 1.7, Math.PI / 4, 0]}>
                <meshStandardMaterial
                    color="#7c5cff"
                    emissive="#7c5cff"
                    emissiveIntensity={1.4}
                    toneMapped={false}
                />
            </Torus>
            <Torus args={[2.8, 0.006, 16, 96]} rotation={[Math.PI / 2.8, Math.PI / 1.8, 0]}>
                <meshStandardMaterial
                    color="#a3e635"
                    emissive="#a3e635"
                    emissiveIntensity={1.2}
                    toneMapped={false}
                />
            </Torus>

            <Satellite radius={2.05} speed={0.6} phase={0} tilt={Math.PI / 2.2} size={0.10} color="#22d3ee"/>
            <Satellite radius={2.45} speed={-0.4} phase={1.8} tilt={Math.PI / 1.7} size={0.08} color="#7c5cff"/>
            <Satellite radius={2.8} speed={0.3} phase={3.1} tilt={Math.PI / 2.8} size={0.06} color="#a3e635" shape="sphere"/>
            {!mobile && (
                <Satellite radius={2.25} speed={-0.7} phase={2.2} tilt={Math.PI / 1.5} size={0.07} color="#fb7185"/>
            )}
        </group>
    );
};

const CrystalCanvas = () => {
    const wrapRef = useRef(null);
    const [inView, setInView] = useState(true);
    const [mobile] = useState(isMobile);
    const [reduceMotion] = useState(prefersReducedMotion);

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "100px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrapRef} className="w-full h-full">
            <Canvas
                shadows={!mobile}
                frameloop={inView && !reduceMotion ? "always" : "demand"}
                dpr={mobile ? [1, 1.25] : [1, 1.75]}
                gl={{
                    preserveDrawingBuffer: false,
                    antialias: !mobile,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                camera={{position: [0, 0, 8], fov: 34, near: 0.1, far: 200}}
            >
                <Suspense fallback={<CanvasLoader/>}>
                    <ambientLight intensity={0.55}/>
                    <hemisphereLight color="#a78bfa" groundColor="#06070d" intensity={0.8}/>
                    <directionalLight position={[5, 5, 5]} intensity={1.8} color="#a78bfa"/>
                    <pointLight position={[-5, -3, -2]} intensity={1.4} color="#22d3ee"/>
                    <pointLight position={[5, -2, 3]} intensity={1.1} color="#fb7185"/>
                    {!mobile && (
                        <pointLight position={[0, 4, -4]} intensity={0.9} color="#7c5cff"/>
                    )}
                    <Core reduceMotion={reduceMotion} mobile={mobile}/>
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={!reduceMotion}
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default CrystalCanvas;
