import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const EXPERIENCE = [
    { title: 'DATA SCIENCE INTERN', subtitle: 'Prodigy InfoTech • June 2026', detail: 'Worked in a data science internship environment and strengthened practical data analysis and machine learning skills.' },
    { title: '9.60 CGPA', subtitle: 'B.Tech Artificial Intelligence & Data Science', detail: 'Strong academic performance with a 9.71 SGPA in Semester II.' },
    { title: 'ACHIEVEMENTS', subtitle: 'AI • Hackathons • Technical Events', detail: 'Solution Challenge 2026, Thinkathon 9.0, Prompt Injection Event, Precise Energy 2025 and IET Genesis Club activities.' },
    { title: 'CERTIFICATIONS', subtitle: 'AI • RAG • MongoDB • Cybersecurity', detail: 'ISRO-IIRS AI/ML for Geodata Analysis, Microsoft & NCVET AI in Healthcare, MongoDB RAG and MongoDB Basics, IBM AI and cybersecurity training.' }
];

const StudioRoom = ({ onReady, isExiting, isWarmup }) => {
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
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.025;
    });

    return (
        <group ref={groupRef} position={[0, 0, -25]}>
            <mesh position={[0, 1.1, -0.5]}>
                <planeGeometry args={[12, 7]} />
                <meshBasicMaterial color="#f7f4ed" transparent opacity={0.97} side={THREE.DoubleSide} />
            </mesh>

            <Text position={[0, 3.55, 0]} fontSize={0.7} color="#1a1a1a" anchorX="center" anchorY="middle" font="/fonts/RubikScribble-Regular.ttf">
                EXPERIENCE & ACHIEVEMENTS
            </Text>

            {EXPERIENCE.map((item, index) => {
                const x = index % 2 === 0 ? -3.0 : 3.0;
                const y = index < 2 ? 1.35 : -1.35;
                return (
                    <group key={item.title} position={[x, y, 0]}>
                        <mesh position={[0, 0, -0.08]}>
                            <planeGeometry args={[5.1, 2.35]} />
                            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                        </mesh>
                        <Text position={[0, 0.62, 0]} fontSize={0.28} color="#222" anchorX="center" anchorY="middle" maxWidth={4.4} textAlign="center" font="/fonts/CabinSketch-Bold.ttf">
                            {item.title}
                        </Text>
                        <Text position={[0, 0.12, 0]} fontSize={0.19} color="#444" anchorX="center" anchorY="middle" maxWidth={4.4} textAlign="center" font="/fonts/CabinSketch-Regular.ttf">
                            {item.subtitle}
                        </Text>
                        <Text position={[0, -0.48, 0]} fontSize={0.16} color="#666" anchorX="center" anchorY="middle" maxWidth={4.3} textAlign="center" font="/fonts/CabinSketch-Regular.ttf">
                            {item.detail}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
};

export default StudioRoom;
