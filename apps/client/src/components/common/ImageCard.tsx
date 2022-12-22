import { Box, Text } from '@chakra-ui/react';
import { MediaResponse } from '@nx-next-nest/types';

// TODO: get image from firebase

interface ImageCardProps {
	image: MediaResponse['image'];
}

const ImageCard = ({ image }: ImageCardProps) => {
	const has = !!image;
	return (
		<Box>
			<Text>Image for media: {has ? 'yes' : 'no'}</Text>
		</Box>
	);
};

export default ImageCard;
