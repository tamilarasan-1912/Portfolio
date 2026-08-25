import { useState, Suspense, useEffect, useCallback, lazy } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Preload, useTexture, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

import Preloader from './components/dom/Preloader';
import PaperTransition from './components/dom/PaperTransition';
import { AudioProvider, useAudio } from './context/AudioManager';
import { initAudio } from './utils/audioManager';
import { PerformanceProvider, usePerformance } from './context/PerformanceContext';
import { SceneProvider, useScene } from './context/SceneContext';
import NavigationUI from './components/ui/NavigationUI';
import GlobalOverlay from './components/ui/GlobalOverlay';
import ScreenReaderOverlay from './components/ui/ScreenReaderOverlay';
import { useDocumentMeta } from './hooks/useDocumentMeta';
import { loadSanityData } from './hooks/useSanityData';
import './styles/main.scss';

// Optional analytics: the portfolio must work even when no PostHog credentials
// are configured in the deployment environment.
import posthog from 'posthog-js';
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST;
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

// Lazy load the heavy 3D experience.
const Experience = lazy(() => import('./components/canvas/Experience'));

import {
  ENTRANCE_TEXTURES,
  CORRIDOR_TEXTURES,
  UI_TEXTURES,
  ABOUT_TEXTURES,
  IMAGE_ASSETS,
  filterTexturesByDevice,
} from './config/texturePreloadList';
import { TextureLoader } from 'three';

const preloadBrowserImage = (path) => {
  if (typeof window === 'undefined' || !path) return;
  const img = new Image();
  img.src = path;
};

const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
const isWeakCPU = typeof navigator.hardwareConcurrency !== 'undefined' && navigator.hardwareConcurrency <= 4;
const isLowRAM = typeof navigator.deviceMemory !== 'undefined' && navigator.deviceMemory <= 4;
const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 450;
const isLowEnd = isMobileDevice || isWeakCPU || isLowRAM || isSmallScreen;
const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

// Preload only the essential textures. More aggressive preloading from the
// original template could fail before React mounts on some browsers/devices.
try {
  const core = [...ENTRANCE_TEXTURES, ...CORRIDOR_TEXTURES, ...UI_TEXTURES, ...IMAGE_ASSETS];
  const filteredCore = filterTexturesByDevice(core, supportsHover);
  filteredCore.forEach((path) => {
    if (path) useTexture.preload(path);
  });
  if (!isLowEnd) {
    const filteredAbout = filterTexturesByDevice(ABOUT_TEXTURES, supportsHover);
    filteredAbout.forEach((path) => {
      if (path) useLoaderSafePreload(path);
    });
  }
} catch (error) {
  // Asset preloading is an optimization, never a reason to prevent the app
  // from rendering.
  console.warn('[Preload] Skipped optional texture preloading:', error);
}

function useLoaderSafePreload(path) {
  // Kept as a normal function so preloading failures cannot crash application startup.
  // The actual room components load their textures when they render.
  return path;
}

const GlobalAudioEnabler = () => {
  const { enableAudio } = useAudio();
  useEffect(() => {
    const handleInteraction = () => enableAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [enableAudio]);
  return null;
};

const PaperSceneBackground = () => {
  const { scene } = useThree();
  const texture = useTexture('/textures/paper-texture.webp');

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    return () => {
      scene.background = null;
    };
  }, [scene, texture]);

  return null;
};

function DocumentMetaBridge() {
  useDocumentMeta();
  const { initialRoom, deeplinkHandled, hasEntered, teleportTo } = useScene();

  useEffect(() => {
    if (initialRoom && hasEntered && !deeplinkHandled.current) {
      deeplinkHandled.current = true;
      setTimeout(() => teleportTo(initialRoom), 300);
    }
  }, [initialRoom, hasEntered, teleportTo, deeplinkHandled]);

  return null;
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const { settings, downgradeTier, tier } = usePerformance();

  useEffect(() => {
    initAudio();
  }, []);

  const handleSceneReady = useCallback(() => {
    requestAnimationFrame(() => setSceneReady(true));
  }, []);

  return (
    <AudioProvider>
      <SceneProvider>
        <DocumentMetaBridge />
        <GlobalAudioEnabler />
        <div className="app">
          <div className="canvas-wrapper">
            <Canvas
              camera={{ position: [0, 0.2, 28], fov: 60, near: 0.1, far: 150 }}
              gl={{
                antialias: settings.antialias,
                alpha: false,
                powerPreference: settings.powerPreference,
                localClippingEnabled: true,
                // Do not fail the whole application on mobile/driver quirks.
                failIfMajorPerformanceCaveat: false,
              }}
              dpr={settings.dpr}
              shadows={settings.shadows}
            >
              <color attach="background" args={['#fafafa']} />
              <fog attach="fog" args={['#fafafa', 15, 50]} />

              <PerformanceMonitor
                onDecline={() => downgradeTier()}
                flipflops={3}
                onFallback={() => downgradeTier()}
              />

              <Suspense fallback={null}>
                <Experience
                  isLoaded={isLoaded}
                  onSceneReady={handleSceneReady}
                  performanceTier={tier}
                />
                <Preload all />
              </Suspense>
            </Canvas>
          </div>

          {isLoaded && (
            <>
              <NavigationUI />
              <GlobalOverlay />
              <PaperTransition />
              <ScreenReaderOverlay />
            </>
          )}

          <Preloader ready={sceneReady} onComplete={() => setIsLoaded(true)} />
        </div>
      </SceneProvider>
    </AudioProvider>
  );
}

import { AchievementsProvider } from './context/AchievementsContext';

export default function App() {
  useEffect(() => {
    // Sanity is disabled unless explicitly configured. This is safe in a
    // deployment with no CMS credentials and prevents inherited remote data.
    loadSanityData();

    const filteredImages = filterTexturesByDevice(IMAGE_ASSETS, supportsHover);
    filteredImages.forEach((path) => preloadBrowserImage(path));
  }, []);

  return (
    <PerformanceProvider>
      <AchievementsProvider>
        <AppContent />
      </AchievementsProvider>
    </PerformanceProvider>
  );
}
