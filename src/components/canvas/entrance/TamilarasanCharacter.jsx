import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

const TamilarasanCharacter = ({ position = [-4.25, 0.3, 22.42], scale = 1 }) => {
  const groupRef = useRef();
  const texture = useTexture('/images/tamilarasan-character.svg');

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2) * 0.015;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[1.85, 4.23]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default TamilarasanCharacter;
