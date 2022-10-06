import { Box } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface BodyProps {
	children: ReactNode;
	v?: boolean;
	h?: boolean;
}

const Body: FC<BodyProps> = ({ children, v, h }) => {
	return (
		<Box
			display='flex'
			alignItems={v ? 'center' : undefined}
			justifyContent={h ? 'center' : undefined}
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
