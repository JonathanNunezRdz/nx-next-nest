import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/user';

const SignedInHome: FC = () => {
	const user = useAppSelector(selectUser);

	return (
		<Box>
			<Heading>Welcome - {user.alias}</Heading>
		</Box>
	);
};

export default SignedInHome;
