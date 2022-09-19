import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';

import defaultSEOConfig from '../next-seo.config';
import Chakra from '../src/Chakra';
import Layout from '../src/components/layout';

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<Chakra>
			<Head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
				/>
			</Head>
			<DefaultSeo {...defaultSEOConfig} />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</Chakra>
	);
}

export default CustomApp;
