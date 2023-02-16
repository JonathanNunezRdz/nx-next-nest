import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import LinkButton from '@client/src/components/common/LinkButton';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectMediaAppliedFilters } from '@client/src/store/media';
import {
	deleteMediaAction,
	getMediasAction,
} from '@client/src/store/media/actions';
import { MediaType } from '@prisma/client';

interface KnowQuery {
	knownByMe: false;
	mediaIdString: string;
	mediaTitle: string;
	mediaTypeString: MediaType;
}

interface EditQuery {
	knownByMe: true;
	mediaIdString: string;
}

interface MediaActionButtonsProps {
	isLoggedIn: boolean;
	query: KnowQuery | EditQuery;
}

const MediaActionButtons = ({ isLoggedIn, query }: MediaActionButtonsProps) => {
	const dispatch = useAppDispatch();
	const { appliedFilters } = useAppSelector(selectMediaAppliedFilters);
	const handleDeleteMedia = async () => {
		const res = await dispatch(
			deleteMediaAction({ mediaId: query.mediaIdString })
		);
		if (res.meta.requestStatus === 'fulfilled')
			dispatch(getMediasAction(appliedFilters));
	};
	if (!isLoggedIn) return null;

	if (query.knownByMe)
		return (
			<Box>
				<LinkButton
					pathname='/media/edit'
					query={{
						mediaIdString: query.mediaIdString,
					}}
					iconButtonProps={{
						'aria-label': 'edit media',
						icon: <EditIcon />,
						size: 'xs',
						me: '1',
						colorScheme: 'yellow',
					}}
				/>
				<IconButton
					aria-label='delete media'
					icon={<DeleteIcon />}
					size='xs'
					colorScheme='red'
					onClick={handleDeleteMedia}
				/>
			</Box>
		);
	if (query.knownByMe === false)
		return (
			<LinkButton
				pathname='/media/know'
				query={{
					mediaIdString: query.mediaIdString,
					mediaTitle: query.mediaTitle,
					mediaTypeString: query.mediaTypeString,
				}}
				iconButtonProps={{
					'aria-label': 'finished it',
					icon: <CheckIcon />,
					size: 'xs',
					colorScheme: 'green',
				}}
			/>
		);
	return null;
};

export default MediaActionButtons;
