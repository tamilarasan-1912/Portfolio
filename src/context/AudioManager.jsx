import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AudioContext = createContext({
    isMuted: false,
    toggleMute: () => { },
    play: () => null,
    enableAudio: () => { },
    audioEnabled: false,
    globalVolume: 0.5,
    setGlobalVolume: () => { },
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('audio_muted') === 'true');
    const [globalVolume, setGlobalVolume] = useState(() => {
        const saved = localStorage.getItem('audio_volume');
        return saved !== null ? parseFloat(saved) : 0.5;
    });
    const [audioEnabled, setAudioEnabled] = useState(false);
    const activeSounds = useRef({});

    useEffect(() => {
        localStorage.setItem('audio_muted', isMuted);
        localStorage.setItem('audio_volume', globalVolume);
        Object.values(activeSounds.current).forEach(audio => {
            if (audio) {
                audio.muted = isMuted;
                const base = audio._baseVolume !== undefined ? audio._baseVolume : 1;
                audio.volume = Math.max(0, Math.min(1, base * globalVolume));
            }
        });
    }, [isMuted, globalVolume]);

    const toggleMute = () => setIsMuted(prev => !prev);
    const enhancedSetGlobalVolume = useCallback((vol) => {
        if (typeof vol === 'function') {
            setGlobalVolume(prev => {
                const next = vol(prev);
                if (next > 0) setIsMuted(false);
                return next;
            });
        } else {
            setGlobalVolume(vol);
            if (vol > 0) setIsMuted(false);
        }
    }, []);
    const enableAudio = useCallback(() => setAudioEnabled(true), []);

    const play = useCallback((soundName, { loop = false, volume = 1.0 } = {}) => {
        const soundPaths = {
            szumwiatru: '/sounds/szumwiatru.mp3',
            szummiasta: '/sounds/szummiasta.mp3',
            uchyleniedrzi: '/sounds/uchyleniedrzwi.mp3',
            otwarciedrzi: '/sounds/otwarciedrwi.mp3',
            zamknieciedrzi: '/sounds/zamknieciedrwi.mp3',
        };
        const path = soundPaths[soundName];

        // Unknown/inherited sounds are harmless no-ops; do not issue 404 requests.
        if (!path) return { stop: () => { }, fade: () => { } };

        const audio = new Audio(path);
        audio.loop = loop;
        audio._baseVolume = volume;
        audio.muted = isMuted;
        audio.volume = Math.max(0, Math.min(1, volume * globalVolume));

        if (activeSounds.current[soundName]) activeSounds.current[soundName].pause();
        activeSounds.current[soundName] = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) playPromise.catch(() => { });

        return {
            stop: () => {
                audio.pause();
                audio.currentTime = 0;
                delete activeSounds.current[soundName];
            },
            fade: () => {
                audio.pause();
                delete activeSounds.current[soundName];
            },
        };
    }, [isMuted, globalVolume]);

    return (
        <AudioContext.Provider value={{
            isMuted,
            toggleMute,
            globalVolume,
            setGlobalVolume: enhancedSetGlobalVolume,
            play,
            enableAudio,
            audioEnabled,
        }}>
            {children}
        </AudioContext.Provider>
    );
};
