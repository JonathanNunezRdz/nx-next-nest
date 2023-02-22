import { Box, Center, Image } from '@chakra-ui/react';
import { MediaResponse, WaifuResponse } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';

import Loading from './Loading';

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	type: MediaType | 'waifu';
	imageName: string;
	imageRoot?: string | undefined;
}

const ImageCard = ({ image, type, imageName }: ImageCardProps) => {
	const has = !!image;
	if (!has) return <></>;
	return (
		<Box>
			<Center>
				<Image
					objectFit='cover'
					src={image.src}
					alt={`${imageName} image`}
					fallback={<Loading />}
					borderRadius='8'
				/>
			</Center>
		</Box>
	);
};

export default ImageCard;
