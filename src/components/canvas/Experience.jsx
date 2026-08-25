import { useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import InfiniteCorridorManager from './corridor/InfiniteCorridorManager';
import EntranceDoors from './entrance/EntranceDoors';
import EmptyCorridor from './entrance/EmptyCorridor';
import TeleportRoom from './corridor/TeleportRoom';
import useInfiniteCamera from '../../hooks/useInfiniteCamera';
import SignSystem from './entrance/SignSystem';
import { useScene } from '../../context/SceneContext';

const ENTRANCE_DOORS_Z = 22;

/**
 * Main 3D experience.
 *
 * The original template eagerly imported and mounted every room during startup
 * through RoomWarmup. That makes the initial bundle much heavier and can crash
 * some browsers/WebGL drivers before the portfolio becomes visible.
 *
 * Rooms are now loaded only when the user enters them. The corridor and
 * entrance remain available immediately.
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

    // The warm-up system from the original template has been removed. Signal
    // scene readiness after the first mounted frame instead of compiling all
    // rooms and shaders before the user can see the portfolio.
    useEffect(() => {
        if (!isLoaded) return;
        const frame = requestAnimationFrame(() => {
            onSceneReady?.();
        });
        return () => cancelAnimationFrame(frame);
    }, [isLoaded, onSceneReady]);

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
                <SignSystem position={[0, 0, ENTRANCE_DOORS_Z]} />
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
