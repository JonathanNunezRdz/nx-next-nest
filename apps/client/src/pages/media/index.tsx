import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import type { FC } from 'react';
import NextLink from 'next/link';

import { useAppDispatch } from '../../store/hooks';
import { getMedias } from '../../store/media';

// TODO: design media filter options

const Media: FC = () => {
	const dispatch = useAppDispatch();

	const handleGetMedia = () => {
		dispatch(
			getMedias({
				cursor: new Date().toISOString(),
				limit: 10,
			})
		);
	};

	return (
		<Box
			display='flex'
			justifyContent='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			<VStack w='full'>
				<Box w='full'>
					<HStack spacing='1rem'>
						<Heading>media</Heading>
						<LinkBox>
							<NextLink href='/media/add' passHref>
								<LinkOverlay>
									<IconButton
										aria-label='add media'
										icon={<AddIcon />}
										size='sm'
									/>
								</LinkOverlay>
							</NextLink>
						</LinkBox>
					</HStack>
				</Box>

				<Box w='full'>
					<SimpleGrid columns={3} spacing={10}>
						<Box bg='gray.500'>
							<Text>Title: Naruto</Text>
						</Box>
					</SimpleGrid>
				</Box>

				<Box>
					<Button onClick={handleGetMedia}>Get media</Button>
				</Box>
			</VStack>
		</Box>
	);
};

export default Media;
