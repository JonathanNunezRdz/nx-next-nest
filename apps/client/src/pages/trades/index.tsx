import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, HStack, VStack } from '@chakra-ui/react';
import LinkButton from '@client/src/components/common/LinkButton';
import Body from '@client/src/components/layout/Body';
import { useAppSelector } from '@client/src/store/hooks';
import { selectAuth } from '@client/src/store/user';
import { NextSeo } from 'next-seo';

export default function Trades() {
	// rtk hooks
	const authStatus = useAppSelector(selectAuth);

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
					</HStack>
				</Box>
			</VStack>
		</Body>
	);
}
