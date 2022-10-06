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
import NextLink from 'next/link';
import { WaifuResponse } from '@nx-next-nest/types';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface WaifuCardProps {
	waifu: WaifuResponse;
	ownId: number;
	isLoggedIn: boolean;
}

const WaifuCard = ({ waifu, ownId, isLoggedIn }: WaifuCardProps) => {
	const bg = useColorModeValue('teal.100', 'teal.500');
	const waifuIsOwn = waifu.userId === ownId;
	return (
		<Box bg={bg} borderRadius='md' p='1rem' pb='0.5rem'>
			<Stat>
				<StatLabel>
					<HStack justifyContent='space-between'>
						<Text>{waifu.level}</Text>
						{isLoggedIn && waifuIsOwn && (
							<Box>
								<LinkBox display='inline-flex'>
									<NextLink
										href={{
											pathname: '/waifu/edit',
											query: {
												waifuIdString: waifu.id,
											},
										}}
										passHref
									>
										<LinkOverlay>
											<IconButton
												aria-label='edit waifu'
												icon={<EditIcon />}
												size='xs'
												me='1'
												colorScheme='yellow'
											/>
										</LinkOverlay>
									</NextLink>
								</LinkBox>
								<IconButton
									aria-label='delete waifu'
									icon={<DeleteIcon />}
									size='xs'
									colorScheme='red'
								/>
							</Box>
						)}
					</HStack>
				</StatLabel>
				<StatNumber>{waifu.name}</StatNumber>
				<StatHelpText>
					Since: {new Date(waifu.since).toDateString()}
				</StatHelpText>
			</Stat>
		</Box>
	);
};

export default WaifuCard;
