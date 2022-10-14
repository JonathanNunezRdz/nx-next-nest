import { Box } from '@chakra-ui/react';
import { ValidJWT } from '@nx-next-nest/types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { setCredentials, setCredentialsChecked } from '../../store/user';
import { useUserQuery } from '../../store';
import { validateJWT } from '../../utils';

import Footer from './Footer';
import Header from './header';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAuth();
	const { data: user, isLoading, isError, error, isSuccess } = useUserQuery();
	useEffect(() => {
		if (isSuccess && !isLoggedIn) {
			console.log('user logged in');
			const jwt = validateJWT() as ValidJWT;
			dispatch(setCredentials({ user, accessToken: jwt.jwt }));
		} else if (isError) {
			console.log('user not logged in');
			dispatch(setCredentialsChecked());
		}
	}, [isSuccess, isLoggedIn, dispatch, isError]);
	// const dispatch = useAppDispatch();
	// const signInStatus = useAppSelector(selectSignInStatus);
	// const userStatus = useAppSelector(selectUserStatus);

	// useEffect(() => {
	// 	if (signInStatus.status === 'succeeded' && userStatus.status === 'idle')
	// 		dispatch(getUser());
	// }, [signInStatus.status, userStatus.status, dispatch]);

	// useEffect(() => {
	// 	if (signInStatus.status === 'idle' && userStatus.status === 'idle')
	// 		dispatch(getLoggedStatus());
	// }, [signInStatus.status, userStatus.status, dispatch]);

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
