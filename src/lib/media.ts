import { getStrapiURL } from './api';

export function getStrapiMedia(media: any) {
	const imageUrl = media.url.startsWith('/') ? getStrapiURL(media.url) : media.url;
	return imageUrl;
}

export function getStrapiMediaProject(media: any) {
	const imageUrl = media.url;
	return imageUrl;
}
