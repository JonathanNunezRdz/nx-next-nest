import { Box, HStack, Text } from '@chakra-ui/react';
import ImageCard from '@client/src/components/common/ImageCard';
import { useCardColor, WaifuLevelLabels } from '@client/src/utils/constants';
import { WaifuResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';

import WaifuActionButtons from './WaifuActionButtons';

interface WaifuCardProps {
	waifu: WaifuResponse;
	ownId: User['id'];
	isLoggedIn: boolean;
}

const WaifuCard = ({ waifu, ownId, isLoggedIn }: WaifuCardProps) => {
	const bg = useCardColor();
	const waifuIsOwn = waifu.userId === ownId;
	return (
		<Box bg={bg} borderRadius='md' p='4'>
			<ImageCard
				image={waifu.image}
				type='waifu'
				imageName={waifu.name}
			/>
			<Box bg='teal.600' borderRadius='md' p='2' my='4'>
				<HStack justifyContent='space-between'>
					<Text fontSize='sm' fontWeight='medium'>
						{WaifuLevelLabels[waifu.level]}
					</Text>
					<WaifuActionButtons
						isLoggedIn={isLoggedIn}
						waifuIsOwn={waifuIsOwn}
						waifuId={waifu.id}
					/>
				</HStack>
				<Text fontWeight='semibold' fontSize='2xl'>
					{waifu.name}
				</Text>
				<Text opacity='0.8' fontSize='sm'>
					Since: {new Date(waifu.since).toDateString()}
				</Text>
				<Text opacity='0.8' fontSize='sm'>
					Owner: {ownId === waifu.userId ? 'me' : waifu.user.alias}
				</Text>
			</Box>
		</Box>
	);
};

export default WaifuCard;
