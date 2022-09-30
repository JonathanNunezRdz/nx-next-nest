import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import Body from '../layout/Body';
import { useAppSelector } from '../../store/hooks';

interface ProtectedPageProps {
	originalUrl: string;
	children: ReactNode;
	center?: boolean;
}

const ProtectedPage = ({
	originalUrl,
	children,
	center,
}: ProtectedPageProps) => {
	const { isLoggedIn, checkedJWT } = useAppSelector(
		(state) => state.user.auth
	);
	const router = useRouter();

	useEffect(() => {
		if (!isLoggedIn && checkedJWT) {
			router.push({
				pathname: '/signin',
				query: {
					redirect: originalUrl,
				},
			});
		}
	}, [isLoggedIn, router, originalUrl, checkedJWT]);

	if (!isLoggedIn) {
		return <Text>unathorized user</Text>;
	}

	if (center) return <Body>{children}</Body>;

	return (
		<Box minHeight='60vh' mb={8} w='full'>
			{children}
		</Box>
	);
};

export default ProtectedPage;
