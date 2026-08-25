import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Sanity is intentionally disabled for this portfolio. All public portfolio
// content is maintained in the local React data files so no inherited CMS
// account or content can appear on the deployed site.
export const sanityClient = createClient({
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-03-01',
});

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source) => builder.image(source);
export const getProxyUrl = (imageBuilder) => {
    if (!imageBuilder) return null;
    const url = imageBuilder.url();
    if (url && typeof window !== 'undefined') {
        return url.replace('https://cdn.sanity.io', '/sanity-cdn');
    }
    return url;
};
