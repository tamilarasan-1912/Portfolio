import { useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import InfiniteCorridorManager from './corridor/InfiniteCorridorManager';
import EntranceDoors from './entrance/EntranceDoors';
import EmptyCorridor from './entrance/EmptyCorridor';
import TeleportRoom from './corridor/TeleportRoom';
import useInfiniteCamera from '../../hooks/useInfiniteCamera';
import SignSystem from './entrance/SignSystem';
import TamilarasanCharacter from './entrance/TamilarasanCharacter';
import { useScene } from '../../context/SceneContext';

const ENTRANCE_DOORS_Z = 22;

/**
 * Main 3D experience.
 *
 * Rooms are loaded only when the user enters them. The corridor and entrance
 * remain available immediately.
 */
const Experience = ({ isLoaded, onSceneReady, performanceTier }) => {
    const {
        hasEntered,
        markEntered,
        enterRoom,
        isTeleporting,
        isInRoom,
    } = useScene();

    const { camera } = useThree();

    const { setCameraOverride } = useInfiniteCamera({
        segmentLength: 80,
        scrollSpeed: 0.025,
        parallaxIntensity: 0.4,
        smoothing: 0.06,
        scrollEnabled: hasEntered && !isTeleporting && !isInRoom,
        parallaxEnabled: hasEntered && !isTeleporting && !isInRoom,
    });

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            onSceneReady?.();
        });
        return () => cancelAnimationFrame(frame);
    }, [onSceneReady]);

    const handleEntranceComplete = useCallback(() => {
        markEntered();
    }, [markEntered]);

    const handleDoorEnter = useCallback((doorId) => {
        enterRoom(doorId);
    }, [enterRoom]);

    return (
        <>
            {!hasEntered && <EmptyCorridor camera={camera} />}

            {!hasEntered && (
                <EntranceDoors
                    position={[0, 0, ENTRANCE_DOORS_Z]}
                    onComplete={handleEntranceComplete}
                />
            )}

            {!hasEntered && (
                <>
                    <SignSystem position={[0, 0, ENTRANCE_DOORS_Z]} />
                    <TamilarasanCharacter position={[-4.2, 0.3, ENTRANCE_DOORS_Z + 0.42]} />
                </>
            )}

            <InfiniteCorridorManager
                onDoorEnter={handleDoorEnter}
                hideDoorsForSegments={hasEntered ? [] : [-1]}
                clipSegmentNeg1={!hasEntered}
                setCameraOverride={setCameraOverride}
            />

            <TeleportRoom />
        </>
    );
};

export default Experience;
