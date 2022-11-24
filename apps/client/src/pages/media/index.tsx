import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Heading,
	HStack,
	IconButton,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { FC, useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMedias,
	selectMedia,
	selectMediaPages,
	selectMediaStatus,
} from '../../store/media';
import MediaCard from './MediaCard';
import { selectUser } from '../../store/user';
import Body from '../../components/layout/Body';
import LinkButton from '../../components/common/LinkButton';

// TODO: design media filter options

const Media: FC = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector((state) => state.user.auth);
	const media = useAppSelector(selectMedia);
	const { currentPage, totalPages } = useAppSelector(selectMediaPages);
	const user = useAppSelector(selectUser);
	const getMediaStatus = useAppSelector(selectMediaStatus);

	const handleGetMedia = useCallback(
		(page: number) => {
			dispatch(
				getMedias({
					page,
					limit: 9,
				})
			);
		},
		[dispatch]
	);

	const handleChangePage = (page: number) => {
		if (page === currentPage) return;
		handleGetMedia(page);
	};

	useEffect(() => {
		handleGetMedia(currentPage);
	}, [handleGetMedia]);

	return (
		<Body h>
			<VStack w='full' spacing='1rem'>
				<Box w='full'>
					<HStack spacing='1rem'>
						<Heading>media</Heading>
						{isLoggedIn && (
							<LinkButton
								pathname='/media/add'
								iconButtonProps={{
									size: 'sm',
									'aria-label': 'add media',
									icon: <AddIcon />,
									mt: 1,
								}}
							/>
						)}
						<Box>
							<IconButton
								aria-label='refresh media'
								icon={<RepeatIcon />}
								size='sm'
								mt={1}
								onClick={() => handleGetMedia(currentPage)}
								isLoading={getMediaStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
				</Box>

				<Box w='full'>
					<SimpleGrid
						columns={{ sm: 1, md: 2, lg: 3 }}
						spacing='1rem'
					>
						{media.length > 0 ? (
							media.map((element) => (
								<MediaCard
									key={element.id}
									media={element}
									ownId={user.id}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>no media has been added to the wia</Text>
							</Box>
						)}
					</SimpleGrid>
				</Box>
				<Center>
					<ButtonGroup isAttached>
						{Array.from({ length: totalPages }, (_, i) => (
							<Button
								key={i}
								isActive={currentPage === i + 1}
								onClick={() => handleChangePage(i + 1)}
							>
								{i + 1}
							</Button>
						))}
					</ButtonGroup>
				</Center>
			</VStack>
		</Body>
	);
};

export default Media;
