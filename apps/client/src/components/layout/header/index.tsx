import type { FC } from 'react';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import HeaderLinks from './HeaderLinks';
import ThemeToggle from './ThemeToggle';

const links = ['media', 'waifus'];

const Header: FC = () => {
	return (
		<Flex as='header' width='full' align='center'>
			<Heading as='h1' size='md'>
				<NextLink href='/' passHref>
					<Link>wia</Link>
				</NextLink>
			</Heading>
			<Box ms='auto'>
				<HeaderLinks links={links} />
				<ThemeToggle />
			</Box>
		</Flex>
	);
};

export default Header;
