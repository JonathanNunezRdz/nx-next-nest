import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	VStack,
} from '@chakra-ui/react';
import { SignInDto } from '@nx-next-nest/types';
import { FormikErrors, useFormik } from 'formik';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';

import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetSignInStatus, selectSignInStatus } from '../../store/user';
import { signInAction } from '../../store/signInAction';

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
			const res = await dispatch(signInAction({ email, password }));
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
		<Body v h>
			<NextSeo title='sign in' />
			<form onSubmit={formik.handleSubmit} noValidate>
				<VStack px='1.5rem' py='1rem' spacing='1rem'>
					<FormErrorMessageWrapper error={signInStatus.error} />
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

					<Box>
						<Button
							type='submit'
							isDisabled={!formik.dirty}
							isLoading={signInStatus.status === 'loading'}
						>
							sign in
						</Button>
					</Box>
				</VStack>
			</form>
		</Body>
	);
};

export default SignIn;
