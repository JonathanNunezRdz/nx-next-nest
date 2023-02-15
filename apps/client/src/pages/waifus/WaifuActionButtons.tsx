import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import LinkButton from '@client/src/components/common/LinkButton';
import { Waifu } from '@prisma/client';

interface WaifuActionButtonsProps {
	isLoggedIn: boolean;
	waifuIsOwn: boolean;
	waifuId: Waifu['id'];
}

const WaifuActionButtons = ({
	isLoggedIn,
	waifuId,
	waifuIsOwn,
}: WaifuActionButtonsProps) => {
	if (isLoggedIn && waifuIsOwn)
		return (
			<Box>
				<LinkButton
					iconButtonProps={{
						'aria-label': 'edit waifu',
						icon: <EditIcon />,
						size: 'xs',
						me: '1',
						colorScheme: 'yellow',
					}}
					pathname='/waifus/edit'
					query={{
						waifuIdString: waifuId,
					}}
				/>
				<IconButton
					aria-label='delete waifu'
					icon={<DeleteIcon />}
					size='xs'
					colorScheme='red'
				/>
			</Box>
		);
	return null;
};

export default WaifuActionButtons;
