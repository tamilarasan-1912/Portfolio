import { useState, Suspense, useEffect, useCallback, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
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
import { AchievementsProvider } from './context/AchievementsContext';
import './styles/main.scss';

// Analytics is optional. The portfolio must render when no Vercel environment
// variables are configured.
import posthog from 'posthog-js';
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

// Load the heavy 3D experience only after the React application has mounted.
const Experience = lazy(() => import('./components/canvas/Experience'));

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
                // Never prevent the portfolio from opening because of a
                // browser/GPU performance-caveat check.
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

export default function App() {
  useEffect(() => {
    // Sanity is disabled in production unless a real project ID is configured.
    // Local portfolio data is used instead.
    loadSanityData();
  }, []);

  return (
    <PerformanceProvider>
      <AchievementsProvider>
        <AppContent />
      </AchievementsProvider>
    </PerformanceProvider>
  );
}
