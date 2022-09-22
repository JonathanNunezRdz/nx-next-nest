import { Box } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface BodyProps {
	children: ReactNode;
}

const Body: FC<BodyProps> = ({ children }) => {
	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			{children}
		</Box>
	);
};

export default Body;
