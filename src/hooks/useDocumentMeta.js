import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * Portfolio metadata and virtual routing for A.Tamilarasan.
 */
const ROOM_META = {
    null: {
        path: '/',
        title: 'A.Tamilarasan — AI & Data Science Portfolio',
        description: 'A.Tamilarasan is a B.Tech Artificial Intelligence and Data Science student building practical AI, machine learning, RAG and data-driven applications.',
    },
    about: {
        path: '/about',
        title: 'About — A.Tamilarasan',
        description: 'Learn about A.Tamilarasan, a B.Tech Artificial Intelligence and Data Science student with a 9.60 CGPA and interests in AI, ML, data science and RAG.',
    },
    gallery: {
        path: '/projects',
        title: 'Projects — A.Tamilarasan',
        description: 'Explore A.Tamilarasan\'s AI, machine learning, data science and software projects.',
    },
    studio: {
        path: '/experience',
        title: 'Experience & Achievements — A.Tamilarasan',
        description: 'View A.Tamilarasan\'s internship experience, achievements, certifications and technical interests.',
    },
    contact: {
        path: '/contact',
        title: 'Contact — A.Tamilarasan',
        description: 'Contact A.Tamilarasan for AI, data science, software and internship opportunities.',
    },
};

const PATH_TO_ROOM = {
    '/': null,
    '/about': 'about',
    '/projects': 'gallery',
    '/experience': 'studio',
    '/contact': 'contact',
};

export function getInitialRoomFromUrl() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return PATH_TO_ROOM[path] !== undefined ? PATH_TO_ROOM[path] : null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined);

    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META.null;

        document.title = meta.title;

        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) descTag.setAttribute('content', meta.description);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom }, '', meta.path);
            } else {
                window.history.pushState({ room: currentRoom }, '', meta.path);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom !== null && hasEntered) {
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
