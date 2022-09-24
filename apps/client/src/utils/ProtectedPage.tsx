import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

interface ProtectedPageProps {
	originalUrl: string;
	children: ReactNode;
}

const ProtectedPage = ({ originalUrl, children }: ProtectedPageProps) => {
	const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
	const router = useRouter();

	useEffect(() => {
		if (!isLoggedIn) {
			router.push({
				pathname: '/signin',
				query: {
					redirect: originalUrl,
				},
			});
		}
	}, [isLoggedIn, router, originalUrl]);

	if (!isLoggedIn) {
		return <Text>unathorized user</Text>;
	}

	return <>{children}</>;
};

export default ProtectedPage;
