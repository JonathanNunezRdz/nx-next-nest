import { ChakraProvider, localStorageManager } from '@chakra-ui/react';
import type { FC } from 'react';
import customTheme from './styles/theme';

interface ChakraProps {
	children: React.ReactNode;
}

const Chakra: FC<ChakraProps> = ({ children }) => {
	return (
		<ChakraProvider
			colorModeManager={localStorageManager}
			theme={customTheme}
		>
			{children}
		</ChakraProvider>
	);
};

export default Chakra;
