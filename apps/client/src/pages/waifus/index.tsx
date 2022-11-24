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
import { useCallback, useEffect } from 'react';

import LinkButton from '../../components/common/LinkButton';
import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/user';
import {
	getAllWaifus,
	selectWaifuPages,
	selectWaifus,
	selectWaifuStatus,
} from '../../store/waifu';
import WaifuCard from './WaifuCard';

const Waifus = () => {
	const dispatch = useAppDispatch();
	const isLoggedIn = useAppSelector((state) => state.user.auth.isLoggedIn);
	const user = useAppSelector(selectUser);
	const waifus = useAppSelector(selectWaifus);
	const waifuPages = useAppSelector(selectWaifuPages);
	const waifuStatus = useAppSelector(selectWaifuStatus);

	const handleGetWaifus = useCallback(
		(page: number) => {
			dispatch(getAllWaifus({ page, limit: 9 }));
		},
		[dispatch]
	);

	useEffect(() => {
		handleGetWaifus(1);
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
								onClick={() => handleGetWaifus(1)}
								isLoading={waifuStatus.status === 'loading'}
							/>
						</Box>
					</HStack>
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
				<Center>
					<Text>More pages</Text>
				</Center>
			</VStack>
		</Body>
	);
};

export default Waifus;
