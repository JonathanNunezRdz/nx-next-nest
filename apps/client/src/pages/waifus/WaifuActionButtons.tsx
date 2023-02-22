import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import LinkButton from '@client/src/components/common/LinkButton';
import { useAppDispatch } from '@client/src/store/hooks';
import { deleteWaifuAction } from '@client/src/store/waifu/actions';
import { Waifu } from '@prisma/client';
import { useRouter } from 'next/router';

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
	// rtk hooks
	const dispatch = useAppDispatch();

	// next hooks
	const router = useRouter();

	// functions
	const handleDeleteWaifu = async () => {
		const from = (): Parameters<typeof deleteWaifuAction>[0]['from'] => {
			if (router.pathname === '/waifus') return '/waifus';
			if (router.pathname === '/media/waifus') return '/media/waifus';
			throw new Error('delete waifu from illegal place');
		};
		dispatch(deleteWaifuAction({ waifuId, from: from() }));
	};

	// render
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
					onClick={handleDeleteWaifu}
				/>
			</Box>
		);
	return null;
};

export default WaifuActionButtons;
