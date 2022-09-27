import { Box, Heading, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageTitleProps {
	title: string;
	children?: ReactNode;
}

const PageTitle = ({ title, children }: PageTitleProps) => {
	return (
		<Box w='full'>
			<HStack spacing='1rem' alignItems='end'>
				<Heading>{title}</Heading>
				{children}
			</HStack>
		</Box>
	);
};

export default PageTitle;
