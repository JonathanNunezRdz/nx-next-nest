import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useAppSelector } from '../store/hooks';

interface ProtectedPageProps {
	url: string;
	children: ReactElement;
}

const ProtectedPage = ({ url, children }: ProtectedPageProps) => {
	const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
	const router = useRouter();

	if (!isLoggedIn) {
		router.push({
			pathname: '/signin',
			query: {
				redirect: url,
			},
		});
		return null;
	}

	return children;
};

export default ProtectedPage;
