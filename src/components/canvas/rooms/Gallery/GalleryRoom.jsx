import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
    { title: 'AI CLIMATE DIGITAL TWIN', description: 'Climate intelligence using IMD/ISRO data, AI forecasting, geospatial analytics and scenario simulation.', stack: 'PyTorch • ConvLSTM • TFT • FastAPI • PostgreSQL/PostGIS' },
    { title: 'BUJI AI ASSISTANT', description: 'AI assistant exploring memory, academic assistance, voice interaction, system control and LLM workflows.', stack: 'Python • LLM • AI Agents • Voice • Memory' },
    { title: 'CAMPUS NAVIGATION', description: 'Campus-oriented navigation software designed around useful location and wayfinding workflows.', stack: 'Software Development • Maps • Navigation' }
];

const GalleryRoom = ({ onReady, isExiting, isWarmup }) => {
    const groupRef = useRef();

    useEffect(() => {
        if (!isWarmup) {
            const timer = setTimeout(() => onReady?.(), 400);
            return () => clearTimeout(timer);
        }
        onReady?.();
    }, [isWarmup, onReady]);

    useFrame((state) => {
        if (!groupRef.current || isExiting) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.015;
    });

    const openGitHub = () => window.open('https://github.com/tamilarasan-1912', '_blank', 'noopener,noreferrer');

    return (
        <group ref={groupRef} position={[0, 0, -25]}>
            <mesh position={[0, 1.2, -0.5]}>
                <planeGeometry args={[12, 7]} />
                <meshBasicMaterial color="#f7f4ed" transparent opacity={0.97} side={THREE.DoubleSide} />
            </mesh>

            <Text position={[0, 3.55, 0]} fontSize={0.7} color="#1a1a1a" anchorX="center" anchorY="middle" font="/fonts/RubikScribble-Regular.ttf">
                SELECTED PROJECTS
            </Text>
            <Text position={[0, 3.02, 0]} fontSize={0.25} color="#555" anchorX="center" anchorY="middle" font="/fonts/CabinSketch-Regular.ttf">
                AI • DATA SCIENCE • INTELLIGENT SOFTWARE
            </Text>

            {PROJECTS.map((project, index) => {
                const x = (index - 1) * 3.8;
                return (
                    <group key={project.title} position={[x, 1.15, 0]}>
                        <mesh position={[0, 0, -0.08]}>
                            <planeGeometry args={[3.35, 4.1]} />
                            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                        </mesh>
                        <Text position={[0, 1.35, 0]} fontSize={0.28} color="#222" anchorX="center" anchorY="middle" maxWidth={2.8} textAlign="center" font="/fonts/CabinSketch-Bold.ttf">
                            {project.title}
                        </Text>
                        <Text position={[0, 0.45, 0]} fontSize={0.19} color="#555" anchorX="center" anchorY="middle" maxWidth={2.8} textAlign="center" font="/fonts/CabinSketch-Regular.ttf">
                            {project.description}
                        </Text>
                        <Text position={[0, -0.55, 0]} fontSize={0.16} color="#333" anchorX="center" anchorY="middle" maxWidth={2.8} textAlign="center" font="/fonts/CabinSketch-Regular.ttf">
                            {project.stack}
                        </Text>
                        <Text position={[0, -1.45, 0]} fontSize={0.22} color="#111" anchorX="center" anchorY="middle" font="/fonts/CabinSketch-Bold.ttf" onClick={openGitHub} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
                            VIEW ON GITHUB →
                        </Text>
                    </group>
                );
            })}
        </group>
    );
};

export default GalleryRoom;
