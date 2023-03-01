import {
	Box,
	Heading,
	HStack,
	IconButton,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useCallback, useEffect } from 'react';
import { usePagination } from '@ajna/pagination';
import { GetMediaDto } from '@nx-next-nest/types';

import MediaCard from './MediaCard';
import MediaFilterOptions from './MediaFilterOptions';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectAuth, selectUser } from '@client/src/store/user';
import {
	selectMedia,
	selectMediaAppliedFilters,
	selectMediaStatus,
} from '@client/src/store/media';
import { getMediasAction } from '@client/src/store/media/actions';
import Body from '@client/src/components/layout/Body';
import LinkButton from '@client/src/components/common/LinkButton';
import CustomPagination from '@client/src/components/common/CustomPagination';
import { NextSeo } from 'next-seo';

function Media() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const media = useAppSelector(selectMedia);
	const getMediaStatus = useAppSelector(selectMediaStatus);
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { totalMedias, appliedFilters } = useAppSelector(
		selectMediaAppliedFilters
	);

	// use-pagination
	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalMedias,
			limits: {
				outer: 2,
				inner: 2,
			},
			initialState: {
				pageSize: 9,
				isDisabled: false,
				currentPage: appliedFilters.page,
			},
		});

	// custom functions
	const handleGetMedia = useCallback(
		(options: GetMediaDto) => {
			setCurrentPage(options.page);
			dispatch(getMediasAction(options));
		},
		[dispatch, setCurrentPage]
	);
	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > totalMedias) return;
		setCurrentPage(nextPage);
		handleGetMedia({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// effects
	useEffect(() => {
		handleGetMedia(appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetMedia]);

	// render
	return (
		<Body h>
			<NextSeo title='media' />
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
						<Heading>media</Heading>
						{isLoggedIn && (
							<LinkButton
								pathname='/media/add'
								iconButtonProps={{
									'aria-label': 'add media',
									icon: <AddIcon />,
									size: 'sm',
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
								onClick={() => handleGetMedia(appliedFilters)}
								isLoading={getMediaStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
					<MediaFilterOptions getMedia={handleGetMedia} />
				</Box>

				<Box alignSelf='start'>
					<CustomPagination
						pages={pages}
						pagesCount={pagesCount}
						currentPage={currentPage}
						isDisabled={isDisabled}
						onPageChange={handleChangePage}
					/>
				</Box>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing='4'>
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

				<Box alignSelf='start'>
					<CustomPagination
						pages={pages}
						pagesCount={pagesCount}
						currentPage={currentPage}
						isDisabled={isDisabled}
						onPageChange={handleChangePage}
					/>
				</Box>
			</VStack>
		</Body>
	);
}

export default Media;
