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

	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [tried, setTried] = useState(false);
	const imagePath = `${type}_images/${encodeURIComponent(imageName)}.${
		image.image.format
	}`;
	useEffect(() => {
		const get = async () => {
			if (!tried) {
				try {
					setLoading(true);
					const res = await getDownloadURL(ref(storage, imagePath));
					setUrl(res);
				} catch (error) {
					console.error(error);
				}
				setLoading(false);
				setTried(true);
			}
		};
		get();
	}, []);
	if (loading)
		return (
			<Center>
				<Loading />
			</Center>
		);
	if (url)
		return (
			<Box>
				<Center>
					<Image
						objectFit='cover'
						src={url}
						alt={`${imageName} image`}
						fallback={<Loading />}
						borderRadius='4'
					/>
				</Center>
			</Box>
		);
	return <Box></Box>;
};

export default ImageCard;
