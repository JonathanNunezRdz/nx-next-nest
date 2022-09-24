import { Box } from '@chakra-ui/react';
import { type FC, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	selectUserStatus,
	getUser,
	selectSignInStatus,
	getLoggedStatus,
} from '../../store/user';
import Footer from './Footer';
import Header from './header';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const signInStatus = useAppSelector(selectSignInStatus);
	const userStatus = useAppSelector(selectUserStatus);

	useEffect(() => {
		if (signInStatus.status === 'succeeded' && userStatus.status === 'idle')
			dispatch(getUser());
	}, [signInStatus.status, userStatus.status, dispatch]);

	useEffect(() => {
		if (signInStatus.status === 'idle' && userStatus.status === 'idle')
			dispatch(getLoggedStatus());
	}, [signInStatus.status, userStatus.status, dispatch]);

	return (
		<Box margin='0 auto' maxWidth={1000} transition='0.5s ease-out'>
			<Box margin='8'>
				<Header />
				<Box as='main' my={22}>
					{children}
				</Box>
				<Footer />
			</Box>
		</Box>
	);
};

export default Layout;
