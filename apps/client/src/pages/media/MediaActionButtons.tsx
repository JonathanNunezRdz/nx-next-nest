import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import { MediaType } from '@prisma/client';

import LinkButton from '../../components/common/LinkButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMedias, selectMediaAppliedFilters } from '../../store/media';
import { deleteMediaAction } from '../../store/deleteMediaAction';

interface KnowQuery {
	knownByMe: false;
	mediaIdString: string | number;
	mediaTitle: string;
	mediaTypeString: MediaType;
}

interface EditQuery {
	knownByMe: true;
	mediaIdString: string | number;
}

interface MediaActionButtonsProps {
	isLoggedIn: boolean;
	query: KnowQuery | EditQuery;
}

const MediaActionButtons = ({ isLoggedIn, query }: MediaActionButtonsProps) => {
	if (!isLoggedIn) return null;
	const dispatch = useAppDispatch();
	const { appliedFilters } = useAppSelector(selectMediaAppliedFilters);
	const handleDeleteMedia = async () => {
		const res = await dispatch(
			deleteMediaAction({ mediaId: query.mediaIdString })
		);
		if (res.meta.requestStatus === 'fulfilled')
			dispatch(getMedias(appliedFilters));
	};

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
