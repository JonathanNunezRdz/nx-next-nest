import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { MediaResponse } from '@nx-next-nest/types';
import NextLink from 'next/link';

interface MediaCardProps {
	media: MediaResponse;
	ownId: number;
	isLoggedIn: boolean;
}

const MediaCard = ({ media, ownId, isLoggedIn }: MediaCardProps) => {
	const bg = useColorModeValue('teal.100', 'teal.500');
	const knownByMe =
		media.knownBy.findIndex((user) => user.userId === ownId) !== -1;

	return (
		<Box bg={bg} borderRadius='md' p='1rem' pb='0.5rem'>
			<Stat>
				<StatLabel>
					<HStack justifyContent='space-between'>
						<Text>{media.type}</Text>
						{isLoggedIn && knownByMe && (
							<Box>
								<IconButton
									aria-label='edit media'
									icon={<EditIcon />}
									size='xs'
									me='1'
									colorScheme='yellow'
								/>
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
				{media.knownBy.map(({ user, knownAt }) => (
					<StatHelpText key={user.id}>
						{ownId === user.id ? 'me' : user.alias} -{' '}
						{new Date(knownAt).toDateString()}
					</StatHelpText>
				))}
			</Stat>
		</Box>
	);
};

export default MediaCard;
