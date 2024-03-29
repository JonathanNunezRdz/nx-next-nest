/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
	title: 'wia',
	titleTemplate: '%s | the-wia',
	defaultTitle: 'wia',
	description: 'The WIA - view your animes and waifus',
	canonical: 'http://localhost:4200',
	openGraph: {
		url: 'http://localhost:4200',
		title: 'wia',
		description: 'The WIA - view your animes and waifus',
		images: [
			{
				url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
				alt: 'nextarter-chakra.sznm.dev og-image',
			},
		],
		site_name: 'the-wia',
	},
	twitter: {
		handle: '@NunezRdz',
		cardType: 'summary_large_image',
	},
};

export default defaultSEOConfig;
