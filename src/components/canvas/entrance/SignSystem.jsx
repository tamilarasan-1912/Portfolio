import { useRef, useMemo } from 'react';
import { Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FONT_URL = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';

const SignSystem = (props) => {
    const groupRef = useRef();
    const mountTexture = useTexture('/textures/entrance/belka.webp');
    const timeOffset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime + timeOffset;
        groupRef.current.rotation.x = Math.sin(time * 2) * 0.05;
        groupRef.current.rotation.y = 0;
    });

    return (
        <group {...props}>
            <mesh position={[-0.05, 2.05, 0.65]}>
                <planeGeometry args={[2.7, 0.4]} />
                <meshBasicMaterial color="#e0e0e0" map={mountTexture} transparent side={THREE.DoubleSide} />
            </mesh>

            <group ref={groupRef} position={[0, 1.9, 0.60]}>
                <mesh position={[0, -0.5, 0]}>
                    <planeGeometry args={[2, 1]} />
                    <meshBasicMaterial color="#f4ead7" transparent side={THREE.DoubleSide} depthWrite={false} />
                </mesh>

                <Text
                    position={[0, -0.28, 0.02]}
                    font={FONT_URL}
                    fontSize={0.20}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.75}
                    textAlign="center"
                >
                    A. TAMILARASAN
                </Text>
                <Text
                    position={[0, -0.58, 0.02]}
                    font={FONT_URL}
                    fontSize={0.095}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.8}
                    textAlign="center"
                >
                    AI & DATA SCIENCE
                </Text>
            </group>
        </group>
    );
};

export default SignSystem;
