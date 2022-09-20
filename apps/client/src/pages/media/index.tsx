import { Box, Button } from '@chakra-ui/react';
import type { FC } from 'react';
import useStore from '../../store';

const Media: FC = () => {
	const getMedia = useStore((state) => state.getMedia);
	const handleGetMedia = () => {
		getMedia();
	};
	return (
		<Box
			display={{ md: 'flex' }}
			alignItems='center'
			justifyContent='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			<Button onClick={handleGetMedia}>Get media</Button>
		</Box>
	);
};

export default Media;
