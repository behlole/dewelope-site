import React, { Suspense, useEffect, useState } from 'react';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import CanvasLoader from '../Loader.jsx';

const Computers = ({ isMobile }) => {
    const computer = useGLTF('./desktop_pc/scene.gltf');

    useEffect(() => {
        computer.scene.traverse((child) => {
            if (child.isMesh) {
                const positions = child.geometry.attributes.position.array;
                const validPositions = validatePositions(positions);

                if (!validPositions) {
                    console.warn(
                        'Invalid positions detected in the "Computers" component.'
                    );
                    // Handle the invalid positions here, e.g., by removing the child mesh or applying default positions.
                }
            }
        });
    }, [computer.scene]);

    const validatePositions = (positions) => {
        for (let i = 0; i < positions.length; i++) {
            if (Number.isNaN(positions[i])) {
                return false;
            }
        }
        return true;
    };

    return (
        <mesh>
            <hemisphereLight intensity={0.15} groundColor="black" />
            <pointLight intensity={1} />
            <spotLight
                position={[-20, 50, 10]}
                angle={0.12}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize={1024}
            />
            <primitive
                object={computer.scene}
                scale={isMobile ? 0.7 : 0.75}
                position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
                rotation={[-0.01, -0.2, -0.1]}
            />
        </mesh>
    );
};

const ComputerCanvas = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(max-width:500px)');
        setIsMobile(media.matches);

        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };

        media.addEventListener('change', handleMediaQueryChange);

        return () => {
            media.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    return (
        <Canvas
            frameloop="demand"
            shadows
            camera={{ position: [20, 3, 5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <Computers isMobile={isMobile} />
            </Suspense>
            <Preload all />
        </Canvas>
    );
};

export default ComputerCanvas;
