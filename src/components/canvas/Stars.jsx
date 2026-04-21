import {useMemo, useRef, Suspense, useEffect, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Points, PointMaterial, Preload} from "@react-three/drei";

const generatePositions = (count, radius) => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random() * 2 - 1;
        const t = Math.random() * Math.PI * 2;
        const f = Math.sqrt(Math.max(0, 1 - u * u));
        const r = radius * Math.cbrt(Math.random());
        arr[i * 3] = r * f * Math.cos(t);
        arr[i * 3 + 1] = r * f * Math.sin(t);
        arr[i * 3 + 2] = r * u;
    }
    return arr;
};

const Stars = (props) => {
    const ref = useRef();
    const positions = useMemo(() => generatePositions(1200, 1.2), []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 12;
            ref.current.rotation.y -= delta / 18;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#a78bfa"
                    size={0.0025}
                    sizeAttenuation
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const StarsCanvas = () => {
    const wrapRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "200px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrapRef} className="w-full h-auto absolute inset-0 z-[-1]">
            {inView && (
                <Canvas
                    camera={{position: [0, 0, 1]}}
                    dpr={[1, 1.5]}
                    gl={{antialias: false, powerPreference: "low-power"}}
                >
                    <Suspense fallback={null}>
                        <Stars/>
                    </Suspense>
                    <Preload all/>
                </Canvas>
            )}
        </div>
    );
};

export default StarsCanvas;
