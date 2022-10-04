import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';
import { formatDate } from '../../utils';

interface KnownAtInputProps {
	label: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	knownAt: string;
}

const KnownAtInput = ({ knownAt, label, onChange }: KnownAtInputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor='knownAt'>when did you {label} it?</FormLabel>
			<Input
				id='knownAt'
				name='knownAt'
				type='date'
				variant='filled'
				onChange={onChange}
				value={knownAt}
				max={formatDate()}
			/>
		</FormControl>
	);
};

export default KnownAtInput;
