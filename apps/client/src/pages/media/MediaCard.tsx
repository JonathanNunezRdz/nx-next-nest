import {
	Box,
	Button,
	Collapse,
	HStack,
	ListItem,
	Stat,
	StatLabel,
	StatNumber,
	Text,
	List,
	useColorModeValue,
	useDisclosure,
	Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { MediaResponse } from '@nx-next-nest/types';

import MediaActionButtons from './MediaActionButtons';
import KnownBy from './KnownBy';
import ImageCard from '../../components/common/ImageCard';

interface MediaCardProps {
	media: MediaResponse;
	ownId: number;
	isLoggedIn: boolean;
}

const MediaCard = ({ media, ownId, isLoggedIn }: MediaCardProps) => {
	const { isOpen, onToggle } = useDisclosure();
	const bg = useColorModeValue('teal.100', 'teal.500');
	const knownByMe =
		media.knownBy.findIndex((user) => user.userId === ownId) !== -1;
	const hasWaifus = media.waifus.length > 0;

	return (
		<Box bg={bg} borderRadius='md' p='1rem' pb='0.5rem'>
			<Stat>
				<StatLabel>
					<HStack justifyContent='space-between'>
						<Text>{media.type}</Text>
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
				</StatLabel>
				<ImageCard image={media.image} />
				<StatNumber>{media.title}</StatNumber>
				<KnownBy users={media.knownBy} ownId={ownId} />
				<Box>
					<Button onClick={onToggle} variant='link' py='0.5rem'>
						{isOpen ? 'hide' : 'view waifus'}
					</Button>
					<Collapse in={isOpen} animateOpacity>
						<Box
							bg='teal.600'
							borderRadius='md'
							p='0.5rem'
							ps='0.75rem'
						>
							<Box>
								<List>
									{hasWaifus ? (
										media.waifus.map((waifu) => (
											<ListItem key={waifu.id}>
												{waifu.name}
											</ListItem>
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
									<Link>show all</Link>
								</NextLink>
							)}
						</Box>
					</Collapse>
				</Box>
			</Stat>
		</Box>
	);
};

export default MediaCard;
