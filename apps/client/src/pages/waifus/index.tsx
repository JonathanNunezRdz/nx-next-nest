import { usePagination } from '@ajna/pagination';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	Heading,
	HStack,
	IconButton,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import CustomPagination from '@client/src/components/common/CustomPagination';
import LinkButton from '@client/src/components/common/LinkButton';
import Body from '@client/src/components/layout/Body';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectAuth, selectUser } from '@client/src/store/user';
import {
	selectWaifuAppliedFilters,
	selectWaifus,
	selectWaifuStatus,
} from '@client/src/store/waifu';
import { getAllWaifusAction } from '@client/src/store/waifu/actions';
import { GetAllWaifusDto } from '@nx-next-nest/types';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect } from 'react';

import WaifuCard from './WaifuCard';
import WaifuFilterOptions from './WaifuFilterOptions';

function Waifus() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const waifus = useAppSelector(selectWaifus);
	const { isLoggedIn } = useAppSelector(selectAuth);
	const getWaifuStatus = useAppSelector(selectWaifuStatus);
	const { totalWaifus, ...appliedFilters } = useAppSelector(
		selectWaifuAppliedFilters
	);

	// use-pagination hook
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

	// functions
	const handleGetWaifus = useCallback(
		(options: GetAllWaifusDto) => {
			setCurrentPage(options.page);
			dispatch(getAllWaifusAction(options));
		},
		[dispatch, setCurrentPage]
	);

	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > totalWaifus) return;
		setCurrentPage(nextPage);
		handleGetWaifus({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// react hooks
	useEffect(() => {
		handleGetWaifus(appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetWaifus]);

	// render
	return (
		<Body h>
			<NextSeo title='waifus' />
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
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

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing='4'>
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
}

export default Waifus;
