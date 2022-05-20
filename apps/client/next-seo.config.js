/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
	titleTemplate: '%s | wia',
	defaultTitle: 'wia',
	description: 'Official v2.0.0 web app for the WIA',
	canonical: 'https://nextarter-chakra.sznm.dev',
	openGraph: {
		url: 'https://nextarter-chakra.sznm.dev',
		title: 'wia',
		description: 'Official v2.0.0 web app for the WIA',
		images: [
			{
				url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
				alt: 'nextarter-chakra.sznm.dev og-image',
			},
		],
		site_name: 'wia',
	},
	twitter: {
		handle: '@NunezRdz',
		cardType: 'summary_large_image',
	},
};

export default defaultSEOConfig;
