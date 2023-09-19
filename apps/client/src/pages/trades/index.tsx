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
import {
	selectGetTradesStatus,
	selectTradeAppliedFilters,
	selectTrades,
} from '@client/src/store/trade';
import { getTradesAction } from '@client/src/store/trade/actions';
import { selectAuth } from '@client/src/store/user';
import { GetTradesDto } from '@nx-next-nest/types';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect } from 'react';
import TradeCard from './TradeCard';

export default function Trades() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const trades = useAppSelector(selectTrades);
	const getTradesStatus = useAppSelector(selectGetTradesStatus);
	const authStatus = useAppSelector(selectAuth);
	const { totalTrades, appliedFilters } = useAppSelector(
		selectTradeAppliedFilters
	);

	// use-pagination
	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalTrades,
			limits: { outer: 2, inner: 2 },
			initialState: {
				pageSize: appliedFilters.limit,
				isDisabled: false,
				currentPage: appliedFilters.page,
			},
		});

	// functions
	const handleGetTrades = useCallback(
		(options: GetTradesDto) => {
			setCurrentPage(options.page);
			dispatch(getTradesAction(options));
		},
		[dispatch, setCurrentPage]
	);
	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > pagesCount) return;
		setCurrentPage(nextPage);
		handleGetTrades({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// effects
	useEffect(() => {
		handleGetTrades(appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetTrades]);

	// render
	return (
		<Body h>
			<NextSeo title='trades' />
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
						<Heading>trades</Heading>
						{authStatus.isLoggedIn && (
							<LinkButton
								pathname='/trades/new'
								iconButtonProps={{
									'aria-label': 'new trade',
									icon: <AddIcon />,
									size: 'sm',
									mt: '1',
								}}
							/>
						)}
						<Box>
							<IconButton
								aria-label='refresh trades'
								icon={<RepeatIcon />}
								size='sm'
								mt={1}
								onClick={() => handleGetTrades(appliedFilters)}
								isLoading={getTradesStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
				</Box>

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{trades.length > 0 ? (
							trades.map((trade) => (
								<TradeCard
									key={trade.id}
									trade={trade}
									isLoggedIn={authStatus.isLoggedIn}
									ownId='asds'
								/>
							))
						) : (
							<Box>
								<Text>no trade has been added to the wia</Text>
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
