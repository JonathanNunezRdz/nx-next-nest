import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { ChangeEventHandler, FocusEventHandler } from 'react';

interface TitleInputProps {
	title: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onBlur: FocusEventHandler<HTMLInputElement>;
	isInvalid: boolean;
	error: string;
}

const TitleInput = ({
	title,
	onChange,
	isInvalid,
	error,
	onBlur,
}: TitleInputProps) => {
	return (
		<FormControl isInvalid={isInvalid} isRequired>
			<FormLabel htmlFor='title'>title</FormLabel>
			<Input
				id='title'
				name='title'
				type='text'
				variant='filled'
				onChange={onChange}
				value={title}
				onBlur={onBlur}
				autoFocus
			/>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default TitleInput;
