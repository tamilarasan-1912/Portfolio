// Sanity is disabled.
// Portfolio content is maintained in local React data files.

export const sanityClient = {
    config: () => ({
        projectId: 'YOUR_PROJECT_ID',
    }),
};

export const urlFor = () => {
    throw new Error('Sanity is disabled for this portfolio.');
};

export const getProxyUrl = (imageBuilder) => {
    if (!imageBuilder) return null;

    const url = imageBuilder.url();

    if (url && typeof window !== 'undefined') {
        return url.replace('https://cdn.sanity.io', '/sanity-cdn');
    }

    return url;
};