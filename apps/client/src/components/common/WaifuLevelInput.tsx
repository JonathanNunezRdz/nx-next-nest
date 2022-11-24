import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { WaifuLevel } from '@prisma/client';
import { ChangeEventHandler } from 'react';
import { WaifuLevelLabels } from '../../utils/constants';

interface WaifuLevelInputProps {
	onChange: ChangeEventHandler<HTMLSelectElement>;
	level: WaifuLevel;
	isDisabled?: boolean;
}

const WaifuLevelInput = ({
	onChange,
	level,
	isDisabled = false,
}: WaifuLevelInputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor='level'>level</FormLabel>
			<Select
				id='level'
				name='level'
				variant='filled'
				onChange={onChange}
				value={level}
				isDisabled={isDisabled}
			>
				{Object.entries(WaifuLevelLabels).map(([value, label]) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</Select>
		</FormControl>
	);
};

export default WaifuLevelInput;
