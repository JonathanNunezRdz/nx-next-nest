import { VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormProps {
	children: ReactNode;
}

const Form = ({ children }: FormProps) => {
	return (
		<VStack px='1rem' py='1rem' spacing='1rem'>
			{children}
		</VStack>
	);
};

export default Form;
