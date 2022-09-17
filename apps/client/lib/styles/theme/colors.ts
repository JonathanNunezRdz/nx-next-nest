import type { DeepPartial, Theme } from '@chakra-ui/react';

const extendedColors: DeepPartial<
	Record<string, Theme['colors']['blackAlpha']>
> = {
	brand: {
		100: '',
		200: '',
		300: '',
		400: '',
		500: '',
		600: '',
		700: '',
		800: '',
		900: '',
	},
};

const overridenChakraColors: DeepPartial<Theme['colors']> = {};

const colors = {
	...extendedColors,
	...overridenChakraColors,
};

export default colors;
