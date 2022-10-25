import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { WaifuLevel } from '@prisma/client';
import { ChangeEventHandler } from 'react';

interface WaifuLevelInputProps {
	onChange: ChangeEventHandler<HTMLSelectElement>;
	level: WaifuLevel;
	isDisabled?: boolean;
}

const WaifuLevelLabels: Record<WaifuLevel, string> = {
	freeAgent: 'free agent',
	genin: 'genin',
	chunin: 'chunin',
	jonin: 'jonin',
	topWaifu: 'top waifu',
};

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
