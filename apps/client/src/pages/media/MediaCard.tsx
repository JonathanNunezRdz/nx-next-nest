import { Box, HStack, ListItem, Text, List, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MediaResponse } from '@nx-next-nest/types';

import MediaActionButtons from './MediaActionButtons';
import KnownBy from './KnownBy';
import ImageCard from '../../components/common/ImageCard';
import { useCardColor } from '../../utils/constants';

interface MediaCardProps {
	media: MediaResponse;
	ownId: number;
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
				<Box>
					<List>
						{hasWaifus ? (
							media.waifus.map((waifu) => (
								<ListItem key={waifu.id}>{waifu.name}</ListItem>
							))
						) : (
							<ListItem>No waifus</ListItem>
						)}
					</List>
				</Box>
				{hasWaifus && (
					<NextLink
						href={{
							pathname: '/media/waifus',
							query: {
								mediaTitle: media.title,
							},
						}}
						passHref
					>
						<Link opacity='0.8'>show all</Link>
					</NextLink>
				)}
			</Box>
		</Box>
	);
};

export default MediaCard;
