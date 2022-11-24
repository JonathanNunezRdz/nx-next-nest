import {
	Box,
	HStack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { WaifuResponse } from '@nx-next-nest/types';

import { WaifuLevelLabels } from '../../utils/constants';
import WaifuActionButtons from './WaifuActionButtons';

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
						<Text>{WaifuLevelLabels[waifu.level]}</Text>
						<WaifuActionButtons
							isLoggedIn={isLoggedIn}
							waifuIsOwn={waifuIsOwn}
							waifuId={waifu.id}
						/>
					</HStack>
				</StatLabel>
				<StatNumber>{waifu.name}</StatNumber>
				<StatHelpText mb='0'>
					Since: {new Date(waifu.since).toDateString()}
				</StatHelpText>
				<StatHelpText>
					Owner: {ownId === waifu.userId ? 'me' : waifu.user.alias}
				</StatHelpText>
			</Stat>
		</Box>
	);
};

export default WaifuCard;
