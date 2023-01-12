import { Box, Center, Image, Spinner, Text } from '@chakra-ui/react';
import { MediaResponse, WaifuResponse } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../../store/api/firebase';
import Loading from './Loading';

// TODO: get image from firebase

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	type: MediaType | 'waifu';
	imageName: string;
	imageRoot?: string | undefined;
}

const ImageCard = ({ image, type, imageName }: ImageCardProps) => {
	const has = !!image;
	if (!has) return;
	return (
		<Box>
			<Center>
				<Image
					objectFit='cover'
					src={image.image.src}
					alt={`${imageName} image`}
					fallback={<Loading />}
					borderRadius='4'
				/>
			</Center>
		</Box>
	);
};

export default ImageCard;
