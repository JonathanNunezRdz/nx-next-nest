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
import {
	Pagination,
	PaginationContainer,
	PaginationNext,
	PaginationPage,
	PaginationPageGroup,
	PaginationPrevious,
	PaginationSeparator,
	usePagination,
} from '@ajna/pagination';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMedias,
	selectMedia,
	selectMediaAppliedFilters,
	selectMediaStatus,
} from '../../store/media';
import MediaCard from './MediaCard';
import { selectAuth, selectUser } from '../../store/user';
import Body from '../../components/layout/Body';
import LinkButton from '../../components/common/LinkButton';
import MediaFilterOptions from './MediaFilterOptions';
import { GetMediaDto } from '@nx-next-nest/types';
import CustomPagination from '../../components/common/CustomPagination';

// TODO: design media filter options

const Media: FC = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useAppSelector(selectUser);

	const media = useAppSelector(selectMedia);
	const { totalMedias, ...appliedFilters } = useAppSelector(
		selectMediaAppliedFilters
	);
	const getMediaStatus = useAppSelector(selectMediaStatus);

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

	const handleGetMedia = useCallback(
		(options: GetMediaDto) => {
			setCurrentPage(options.page);
			dispatch(getMedias(options));
		},
		[dispatch]
	);

	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > totalMedias) return;
		setCurrentPage(nextPage);
		handleGetMedia({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		handleGetMedia(appliedFilters);
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
								onClick={() => handleGetMedia(appliedFilters)}
								isLoading={getMediaStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
					<MediaFilterOptions getMedia={handleGetMedia} />
				</Box>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing='1rem'>
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

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>
			</VStack>
		</Body>
	);
};

export default Media;
