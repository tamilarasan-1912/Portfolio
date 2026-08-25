export const PLATFORM_CONFIG = {
    project: {
        color: '#222222',
        accentColor: '#666666',
        icon: 'AI',
        label: 'Project',
        shape: 'monitor',
    },
    github: {
        color: '#111111',
        accentColor: '#444444',
        icon: 'GH',
        label: 'GitHub',
        shape: 'monitor',
    },
    achievement: {
        color: '#333333',
        accentColor: '#777777',
        icon: '★',
        label: 'Achievement',
        shape: 'tv',
    },
};

const RAW_CONTENT_DATA = [
    {
        id: 'project-climate-digital-twin',
        platform: 'project',
        title: "AI-Powered Digital Twin of India's Climate",
        description: 'Climate intelligence project combining IMD and ISRO data, AI forecasting, geospatial analytics and scenario simulation.',
        url: 'https://github.com/tamilarasan-1912/AI-Powered-Digital-Twin-of-India-s-Climate',
        date: '2026-01-01',
        views: 'GitHub',
    },
    {
        id: 'project-buji-ai-assistant',
        platform: 'project',
        title: 'BUJI AI Assistant',
        description: 'AI assistant exploring memory, academic assistance, voice interaction, system control and LLM-powered workflows.',
        url: 'https://github.com/tamilarasan-1912/BUJI',
        date: '2026-01-01',
        views: 'GitHub',
    },
    {
        id: 'project-campus-navigation',
        platform: 'project',
        title: 'Campus Navigation',
        description: 'Campus-oriented navigation software project focused on helping users find locations and move around campus.',
        url: 'https://github.com/tamilarasan-1912/Campus-Navigation-',
        date: '2026-01-01',
        views: 'GitHub',
    },
    {
        id: 'experience-prodigy',
        platform: 'achievement',
        title: 'Data Science Intern — Prodigy InfoTech',
        description: 'Data Science internship experience completed in June 2026.',
        url: 'https://github.com/tamilarasan-1912',
        date: '2026-06-01',
        views: 'Experience',
    },
    {
        id: 'achievement-cgpa',
        platform: 'achievement',
        title: 'Academic Performance — 9.60 CGPA',
        description: 'B.Tech Artificial Intelligence and Data Science student with a 9.60 CGPA and 9.71 Semester II SGPA.',
        url: 'https://github.com/tamilarasan-1912',
        date: '2026-06-01',
        views: 'Academic',
    },
    {
        id: 'achievement-rag',
        platform: 'achievement',
        title: 'RAG & AI Learning',
        description: 'Built knowledge in Retrieval-Augmented Generation, AI/ML, MongoDB and practical intelligent applications.',
        url: 'https://github.com/tamilarasan-1912',
        date: '2026-01-01',
        views: 'AI / ML',
    },
];

export const CONTENT_DATA = RAW_CONTENT_DATA;

export const getLatestContent = () => {
    if (!RAW_CONTENT_DATA.length) return null;
    return [...RAW_CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
