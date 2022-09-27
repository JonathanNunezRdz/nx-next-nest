import { Box, VStack } from '@chakra-ui/react';
import type { FormEventHandler, ReactNode } from 'react';

interface FormProps {
	children: ReactNode;
	onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form = ({ children, onSubmit }: FormProps) => {
	return (
		<Box>
			<form onSubmit={onSubmit}>
				<VStack px='1.5rem' py='1rem' spacing='1rem'>
					{children}
				</VStack>
			</form>
		</Box>
	);
};

export default Form;
