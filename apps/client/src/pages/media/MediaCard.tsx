import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Collapse,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	ListItem,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	List,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { MediaResponse } from '@nx-next-nest/types';
import NextLink from 'next/link';

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
						{isLoggedIn && knownByMe && (
							<Box>
								<LinkBox display='inline-flex'>
									<NextLink
										href={{
											pathname: '/media/edit',
											query: {
												mediaIdString: media.id,
											},
										}}
										passHref
									>
										<LinkOverlay>
											<IconButton
												aria-label='edit media'
												icon={<EditIcon />}
												size='xs'
												me='1'
												colorScheme='yellow'
											/>
										</LinkOverlay>
									</NextLink>
								</LinkBox>
								<IconButton
									aria-label='delete media'
									icon={<DeleteIcon />}
									size='xs'
									colorScheme='red'
								/>
							</Box>
						)}
						{isLoggedIn && !knownByMe && (
							<LinkBox>
								<NextLink
									href={{
										pathname: '/media/know',
										query: {
											mediaIdString: media.id,
											mediaTitle: media.title,
											mediaTypeString: media.type,
										},
									}}
									passHref
								>
									<LinkOverlay>
										<IconButton
											aria-label='finished it'
											icon={<CheckIcon />}
											size='xs'
											colorScheme='green'
										/>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
						)}
					</HStack>
				</StatLabel>
				<StatNumber>{media.title}</StatNumber>
				{media.knownBy.map(({ user, knownAt }, i) => (
					<StatHelpText
						key={user.id}
						mb={i !== media.knownBy.length - 1 ? '0' : '2'}
					>
						{ownId === user.id ? 'me' : user.alias} -{' '}
						{new Date(knownAt).toDateString()}
					</StatHelpText>
				))}
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
								<Button variant='link' mt='0.5rem'>
									show all
								</Button>
							)}
						</Box>
					</Collapse>
				</Box>
			</Stat>
		</Box>
	);
};

export default MediaCard;
