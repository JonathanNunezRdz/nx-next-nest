import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import Chakra from '../lib/components/Chakra';

import Layout from '../lib/components/layout';
import { store } from '../lib/redux/store';
import '../lib/styles/globals.css';
import defaultSEOConfig from '../next-seo.config';

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
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Provider>
		</Chakra>
	);
}

export default CustomApp;
