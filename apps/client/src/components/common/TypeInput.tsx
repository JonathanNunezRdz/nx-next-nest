import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { MediaType } from '@prisma/client';
import { ChangeEventHandler } from 'react';

interface TypeInputProps {
	onChange: ChangeEventHandler<HTMLSelectElement>;
	type: MediaType;
}

const TypeInput = ({ onChange, type }: TypeInputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor='type'>type</FormLabel>
			<Select
				id='type'
				name='type'
				variant='filled'
				onChange={onChange}
				value={type}
			>
				<option value='anime'>anime</option>
				<option value='manga'>manga</option>
				<option value='videogame'>videogame</option>
			</Select>
		</FormControl>
	);
};

export default TypeInput;
