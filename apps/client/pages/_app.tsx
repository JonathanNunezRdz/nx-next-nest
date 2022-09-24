import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ValidatorProvider } from 'react-class-validator';

import defaultSEOConfig from '../next-seo.config';
import Chakra from '../src/Chakra';
import Layout from '../src/components/layout';
import { store } from '../src/store';

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
				<ValidatorProvider options={{ resultType: 'map' }}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ValidatorProvider>
			</Provider>
		</Chakra>
	);
}

export default CustomApp;
