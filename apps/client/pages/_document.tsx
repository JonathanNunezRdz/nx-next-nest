import { ColorModeScript } from '@chakra-ui/react';
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	type DocumentContext,
} from 'next/document';
import customTheme from '../lib/styles/customTheme';

const APP_NAME = 'wia';

class MyDocument extends Document {
	static getInitialProps(ctx: DocumentContext) {
		return Document.getInitialProps(ctx);
	}

	render() {
		return (
			<Html lang='en'>
				<Head>
					<link
						href='https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap'
						rel='stylesheet'
					/>

					<meta name='application-name' content={APP_NAME} />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta
						name='apple-mobile-web-app-status-bar-style'
						content='default'
					/>
					<meta
						name='apple-mobile-web-app-title'
						content={APP_NAME}
					/>
					<meta name='format-detection' content='telephone=no' />
					<meta name='mobile-web-app-capable' content='yes' />
					<meta name='theme-color' content='#FFFFFF' />

					<link rel='manifest' href='/manifest.json' />
				</Head>
				<body>
					<ColorModeScript
						initialColorMode={customTheme.config?.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
