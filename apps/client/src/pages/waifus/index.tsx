import { usePagination } from '@ajna/pagination';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	Center,
	Heading,
	HStack,
	IconButton,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { GetAllWaifusDto } from '@nx-next-nest/types';
import { useCallback, useEffect } from 'react';
import CustomPagination from '../../components/common/CustomPagination';

import LinkButton from '../../components/common/LinkButton';
import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAuth, selectUser } from '../../store/user';
import {
	getAllWaifus,
	selectWaifuAppliedFilters,
	selectWaifus,
	selectWaifuStatus,
} from '../../store/waifu';
import WaifuCard from './WaifuCard';
import WaifuFilterOptions from './WaifuFilterOptions';

const Waifus = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useAppSelector(selectUser);

	const waifus = useAppSelector(selectWaifus);
	const { totalWaifus, ...appliedFilters } = useAppSelector(
		selectWaifuAppliedFilters
	);
	const getWaifuStatus = useAppSelector(selectWaifuStatus);

	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalWaifus,
			limits: {
				inner: 2,
				outer: 2,
			},
			initialState: {
				pageSize: 9,
				isDisabled: false,
				currentPage: appliedFilters.page,
			},
		});

	const handleGetWaifus = useCallback(
		(options: GetAllWaifusDto) => {
			setCurrentPage(options.page);
			dispatch(getAllWaifus(options));
		},
		[dispatch]
	);

	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > totalWaifus) return;
		setCurrentPage(nextPage);
		handleGetWaifus({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		handleGetWaifus(appliedFilters);
	}, [handleGetWaifus]);

	return (
		<Body h>
			<VStack w='full' spacing='1rem'>
				<Box w='full'>
					<HStack spacing='1rem'>
						<Heading>waifus</Heading>
						{isLoggedIn && (
							<LinkButton
								pathname='/waifus/add'
								iconButtonProps={{
									'aria-label': 'add waifu',
									icon: <AddIcon />,
									size: 'sm',
									mt: '1',
								}}
							/>
						)}
						<Box>
							<IconButton
								aria-label='refresh waifus'
								icon={<RepeatIcon />}
								size='sm'
								mt={1}
								onClick={() => handleGetWaifus(appliedFilters)}
								isLoading={getWaifuStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
					<WaifuFilterOptions getWaifus={handleGetWaifus} />
				</Box>

				<Box w='full'>
					<SimpleGrid
						columns={{ sm: 1, md: 2, lg: 3 }}
						spacing='1rem'
					>
						{waifus.length > 0 ? (
							waifus.map((element) => (
								<WaifuCard
									key={element.id}
									waifu={element}
									ownId={user.id}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>
									no waifus have been added to the wia
								</Text>
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

export default Waifus;
