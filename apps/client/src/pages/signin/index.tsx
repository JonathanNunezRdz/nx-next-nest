import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
	VStack,
} from '@chakra-ui/react';
import { SignInDto } from '@nx-next-nest/types';
import { FormikErrors, useFormik } from 'formik';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	resetSignInStatus,
	selectSignInStatus,
	signIn,
} from '../../store/user';

const SignIn: FC = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const signInStatus = useAppSelector(selectSignInStatus);
	const formik = useFormik<SignInDto>({
		initialValues: {
			email: '',
			password: '',
		},
		onSubmit: async ({ email, password }) => {
			const res = await dispatch(signIn({ email, password }));
			if (res.meta.requestStatus === 'fulfilled') {
				if (router.query.redirect) {
					router.push(router.query.redirect as string);
				} else {
					router.push('/');
				}
			}
		},
		validate: (values) => {
			const errors: FormikErrors<SignInDto> = {};
			if (!values.email) errors.email = 'email must not be empty';
			else if (
				!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
			)
				errors.email = 'invalid email address';

			if (!values.password)
				errors.password = 'password must not be empty';
			return errors;
		},
	});

	useEffect(() => {
		return () => {
			dispatch(resetSignInStatus());
		};
	}, [dispatch]);

	return (
		<Body>
			<NextSeo title='sign in' />
			<form onSubmit={formik.handleSubmit} noValidate>
				<VStack px='1.5rem' py='1rem' spacing='1rem'>
					<FormControl
						isInvalid={
							!!formik.errors.email && formik.touched.email
						}
					>
						<FormLabel>email address</FormLabel>
						<Input
							id='email'
							name='email'
							type='email'
							variant='filled'
							value={formik.values.email}
							onChange={formik.handleChange}
						/>
						<FormErrorMessage>
							{formik.errors.email}
						</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={
							!!formik.errors.password && formik.touched.password
						}
					>
						<FormLabel>password</FormLabel>
						<Input
							id='password'
							name='password'
							type='password'
							variant='filled'
							value={formik.values.password}
							onChange={formik.handleChange}
						/>
						<FormErrorMessage>
							{formik.errors.password}
						</FormErrorMessage>
					</FormControl>

					<Box color='red.300'>
						{signInStatus.error &&
							(typeof signInStatus.error === 'object' ? (
								signInStatus.error.map((message) => (
									<Text key={message}>{message}</Text>
								))
							) : (
								<Text>{signInStatus.error}</Text>
							))}
					</Box>

					<Box>
						<Button type='submit'>sign in</Button>
					</Box>
				</VStack>
			</form>
		</Body>
	);
};

export default SignIn;
