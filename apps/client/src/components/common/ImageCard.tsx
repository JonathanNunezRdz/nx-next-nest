import { Box, Center, Image } from '@chakra-ui/react';
import { MediaResponse, WaifuResponse } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';

import Loading from './Loading';
import { useEffect, useState } from 'react';
import { storage } from '@client/src/store/api/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

// TODO: get image from imageKit

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	type: MediaType | 'waifu';
	imageName: string;
	imageRoot?: string | undefined;
}

const ImageCard = ({ image, type, imageName }: ImageCardProps) => {
	const [imageSrc, setImageSrc] = useState('');
	const has = !!image;
	useEffect(() => {
		(async () => {
			if (has) {
				const url = await getDownloadURL(ref(storage, image.src));
				setImageSrc(url);
			}
		})();
	}, [has, imageName, image, type]);
	if (!has) return <></>;
	return (
		<Box>
			<Center>
				<Image
					objectFit='cover'
					src={imageSrc}
					alt={`${imageName} image`}
					fallback={<Loading />}
					borderRadius='8'
				/>
			</Center>
		</Box>
	);
};

export default ImageCard;
