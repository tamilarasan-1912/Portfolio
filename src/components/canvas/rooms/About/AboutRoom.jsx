import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../../context/SceneContext';
import { useAchievements } from '../../../../context/AchievementsContext';

const AboutRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
    const groupRef = useRef();
    const { isTeleporting } = useScene();
    const { showTutorial, hidePopup } = useAchievements();

    useEffect(() => {
        if (isExiting || isTeleporting) hidePopup();
    }, [isExiting, isTeleporting, hidePopup]);

    useEffect(() => {
        if (!isWarmup) {
            const timer = setTimeout(() => {
                onReady?.();
                if (!isExiting && !isTeleporting) showTutorial?.('about_fly');
            }, 500);
            return () => clearTimeout(timer);
        }
        onReady?.();
    }, [isWarmup, onReady, isExiting, isTeleporting, showTutorial]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y = Math.sin(t * 0.45) * 0.03;
    });

    return (
        <group ref={groupRef} position={[0, 0, -25]}>
            <mesh position={[0, 1.1, -0.4]}>
                <planeGeometry args={[9, 5.5]} />
                <meshBasicMaterial color="#f7f4ed" transparent opacity={0.96} side={THREE.DoubleSide} />
            </mesh>

            <Text
                position={[0, 2.35, 0]}
                fontSize={0.72}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/fonts/RubikScribble-Regular.ttf"
            >
                A.TAMILARASAN
            </Text>

            <Text
                position={[0, 1.72, 0]}
                fontSize={0.34}
                color="#444444"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
            >
                B.Tech Artificial Intelligence & Data Science
            </Text>

            <Text
                position={[0, 1.15, 0]}
                fontSize={0.25}
                color="#555555"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
                maxWidth={7.5}
            >
                I build practical AI, machine learning, RAG and data-driven applications.
            </Text>

            <Text
                position={[-2.8, 0.35, 0]}
                fontSize={0.32}
                color="#222222"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Bold.ttf"
            >
                9.60 CGPA
            </Text>
            <Text
                position={[0, 0.35, 0]}
                fontSize={0.32}
                color="#222222"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Bold.ttf"
            >
                AI / ML / RAG
            </Text>
            <Text
                position={[2.8, 0.35, 0]}
                fontSize={0.32}
                color="#222222"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Bold.ttf"
            >
                PYTHON / SQL
            </Text>

            <Text
                position={[0, -0.35, 0]}
                fontSize={0.22}
                color="#666666"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
                maxWidth={7.5}
            >
                Machine Learning • Data Science • MongoDB • Git & GitHub
            </Text>

            <Text
                position={[0, -1.05, 0]}
                fontSize={0.28}
                color="#333333"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
                maxWidth={7.5}
            >
                Data Science Intern — Prodigy InfoTech • June 2026
            </Text>

            <Text
                position={[0, -1.65, 0]}
                fontSize={0.22}
                color="#777777"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
                maxWidth={7.5}
            >
                Focused on building useful systems, learning continuously and solving real problems with AI.
            </Text>
        </group>
    );
};

export default AboutRoom;
