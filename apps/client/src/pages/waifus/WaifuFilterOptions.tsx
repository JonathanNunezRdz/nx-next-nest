import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	HStack,
	Input,
	SimpleGrid,
	useBreakpointValue,
} from '@chakra-ui/react';
import { GetAllWaifusDto } from '@nx-next-nest/types';
import { WaifuLevel } from '@prisma/client';
import { Fragment } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { WaifuLevelLabels } from '../../utils/constants';

type FilterInputs = Record<WaifuLevel, boolean> & {
	name: string;
};

interface WaifuFilterOptionsProps {
	getWaifus: (options: GetAllWaifusDto) => void;
}

const WaifuFilterOptions = ({ getWaifus }: WaifuFilterOptionsProps) => {
	const { register, handleSubmit, reset, control } = useForm<FilterInputs>({
		defaultValues: {
			nationalTreasure: false,
			freeAgent: false,
			genin: false,
			chunin: false,
			jonin: false,
			topWaifu: false,
			name: '',
		},
	});
	const onSubmit: SubmitHandler<FilterInputs> = (data) => {
		const level: WaifuLevel[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (value === true) level.push(key as WaifuLevel);
		});

		getWaifus({
			page: 1,
			limit: 9,
			name: data.name,
			level,
		});
	};

	const resetFilters = () => {
		reset();
		getWaifus({ page: 1, limit: 9 });
	};

	const Component = useBreakpointValue({ base: Fragment, lg: HStack });

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<SimpleGrid
					columns={{ sm: 1, md: 2, lg: 3 }}
					spacing='1rem'
					alignItems='end'
				>
					<FormControl>
						<FormLabel htmlFor='name'>name</FormLabel>
						<Input
							id='name'
							placeholder='filter by name'
							{...register('name')}
						/>
					</FormControl>

					<FormControl>
						<FormLabel htmlFor='level'>level</FormLabel>
						<CheckboxGroup>
							<HStack spacing='1rem'>
								{Object.entries(WaifuLevelLabels).map(
									([level, label]) => (
										<Controller
											key={level}
											control={control}
											name={level as WaifuLevel}
											defaultValue={false}
											render={({
												field: { onChange, value, ref },
											}) => (
												<Checkbox
													onChange={onChange}
													ref={ref}
													isChecked={value}
												>
													{label}
												</Checkbox>
											)}
										/>
									)
								)}
							</HStack>
						</CheckboxGroup>
					</FormControl>
					<Component>
						<Button onClick={resetFilters} width='full'>
							reset
						</Button>
						<Button type='submit' width='full'>
							search
						</Button>
					</Component>
				</SimpleGrid>
			</form>
		</Box>
	);
};

export default WaifuFilterOptions;
