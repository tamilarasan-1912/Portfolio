import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const TamilarasanCharacter = ({ position = [-4.25, 0.3, 22.42], scale = 1 }) => {
  const groupRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      '/images/tamilarasan-character.svg',
      (loadedTexture) => {
        if (!mounted) return;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        // A missing optional portrait must never crash the 3D experience.
      }
    );
    return () => { mounted = false; };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2) * 0.015;
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[1.85, 4.23]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default TamilarasanCharacter;
