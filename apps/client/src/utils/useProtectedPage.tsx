import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

interface UseProtectedPageProps {
	originalUrl: string;
}

const useProtectedPage = ({ originalUrl }: UseProtectedPageProps) => {
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
};

export default useProtectedPage;
