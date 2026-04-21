import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Preload, useGLTF} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
    const earth = useGLTF("./planet/scene.gltf");

    // Sanitize potential NaN positions in the loaded GLTF
    useEffect(() => {
        earth.scene.traverse((child) => {
            if (child.isMesh && child.geometry?.attributes?.position) {
                const pos = child.geometry.attributes.position.array;
                for (let i = 0; i < pos.length; i++) {
                    if (Number.isNaN(pos[i])) pos[i] = 0;
                }
                child.geometry.computeBoundingSphere();
            }
        });
    }, [earth.scene]);

    return (
        <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0}/>
    );
};

const EarthCanvas = () => {
    const wrapRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!wrapRef.current || typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([e]) => setInView(e.isIntersecting),
            {rootMargin: "300px 0px"}
        );
        obs.observe(wrapRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrapRef} className="w-full h-full">
            {inView && (
                <Canvas
                    shadows
                    frameloop="demand"
                    dpr={[1, 1.5]}
                    gl={{preserveDrawingBuffer: false, antialias: true, powerPreference: "high-performance"}}
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 200,
                        position: [-4, 3, 6],
                    }}
                >
                    <Suspense fallback={<CanvasLoader/>}>
                        <OrbitControls
                            autoRotate
                            enableZoom={false}
                            maxPolarAngle={Math.PI / 2}
                            minPolarAngle={Math.PI / 2}
                        />
                        <Earth/>
                        <Preload all/>
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default EarthCanvas;
