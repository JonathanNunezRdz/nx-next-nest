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
import { useFormik } from 'formik';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useValidation } from 'react-class-validator';
import type { FC } from 'react';

import Body from '../../components/layout/Body';
import { useAppDispatch } from '../../store/hooks';
import { signIn } from '../../store/user';

const SignIn: FC = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [validate] = useValidation(SignInDto);
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
		validate,
	});

	return (
		<Body>
			<NextSeo title='sign in' />
			<form onSubmit={formik.handleSubmit}>
				<VStack px='1.5rem' py='1rem' spacing='1rem'>
					<FormControl
						isInvalid={
							!!formik.errors.email && formik.touched.email
						}
					>
						<FormLabel>Email address</FormLabel>
						<Input
							type='email'
							variant='filled'
							value={formik.values.email}
							onChange={formik.handleChange}
						/>
						<FormErrorMessage>
							{formik.errors.email}
						</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							type='password'
							variant='filled'
							value={formik.values.password}
							onChange={formik.handleChange}
						/>
					</FormControl>

					<Box>
						<Button type='submit'>Sign In</Button>
					</Box>
				</VStack>
			</form>
		</Body>
	);
};

export default SignIn;
