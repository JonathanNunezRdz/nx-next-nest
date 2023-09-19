import {
	Box,
	HStack,
	ListItem,
	Text,
	List,
	LinkBox,
	LinkOverlay,
	Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { MediaResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';

import MediaActionButtons from './MediaActionButtons';
import KnownBy from './KnownBy';
import { useCardColor } from '@client/src/utils/constants';
import ImageCard from '@client/src/components/common/ImageCard';

interface MediaCardProps {
	media: MediaResponse;
	ownId: User['id'];
	isLoggedIn: boolean;
}

const MediaCard = ({ media, ownId, isLoggedIn }: MediaCardProps) => {
	const bg = useCardColor();
	const knownByMe =
		media.knownBy.findIndex((user) => user.userId === ownId) !== -1;
	const hasWaifus = media.waifus.length > 0;

	return (
		<Box bg={bg} borderRadius='md' p='4'>
			<ImageCard
				image={media.image}
				type={media.type}
				imageName={media.title}
			/>
			<Box bg='teal.600' borderRadius='md' p='2' my='4'>
				<HStack justifyContent='space-between'>
					<Text fontSize='sm' fontWeight='medium'>
						{media.type}
					</Text>
					<MediaActionButtons
						isLoggedIn={isLoggedIn}
						query={{
							knownByMe: knownByMe,
							mediaIdString: media.id,
							mediaTitle: media.title,
							mediaTypeString: media.type,
						}}
					/>
				</HStack>

				<Text fontWeight='semibold' fontSize='2xl'>
					{media.title}
				</Text>
				<KnownBy users={media.knownBy} ownId={ownId} />
			</Box>
			<Box bg='teal.600' borderRadius='md' p='2'>
				<VStack alignItems='start'>
					<Box>
						<Text fontWeight='bold'>waifus</Text>
						<List>
							{hasWaifus ? (
								media.waifus.map((waifu) => (
									<ListItem key={waifu.id}>
										{waifu.name}
									</ListItem>
								))
							) : (
								<ListItem>no waifus</ListItem>
							)}
						</List>
					</Box>

					<LinkBox w='full'>
						<NextLink
							href={{
								pathname: '/media/waifus',
								query: {
									mediaId: media.id,
								},
							}}
							passHref
						>
							<LinkOverlay>
								<Button size='sm' width='full'>
									view all waifus
								</Button>
							</LinkOverlay>
						</NextLink>
					</LinkBox>
				</VStack>
			</Box>
		</Box>
	);
};

export default MediaCard;
