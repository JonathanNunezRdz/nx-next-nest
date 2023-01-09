import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	Input,
	SimpleGrid,
} from '@chakra-ui/react';
import { GetAllWaifusDto } from '@nx-next-nest/types';
import { WaifuLevel } from '@prisma/client';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getAllUsers,
	selectAllUsers,
	selectAllUsersStatus,
} from '../../store/user';
import {
	UserId,
	WaifuFilterInputs,
	WaifuLevelLabels,
} from '../../utils/constants';

interface WaifuFilterOptionsProps {
	getWaifus: (options: GetAllWaifusDto) => void;
}

const WaifuFilterOptions = ({ getWaifus }: WaifuFilterOptionsProps) => {
	// reducers
	const dispatch = useAppDispatch();
	const members = useAppSelector(selectAllUsers);
	const { status, error } = useAppSelector(selectAllUsersStatus);

	// formik
	const { register, handleSubmit, reset, control, getValues } =
		useForm<WaifuFilterInputs>({
			defaultValues: {
				nationalTreasure: false,
				freeAgent: false,
				genin: false,
				chunin: false,
				jonin: false,
				topWaifu: false,
				name: '',
				'1': false,
				'2': false,
				'3': false,
				'4': false,
			},
		});
	const onSubmit: SubmitHandler<WaifuFilterInputs> = (data) => {
		const level: WaifuLevel[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (Object.keys(WaifuLevelLabels).includes(key) && value === true)
				level.push(key as WaifuLevel);
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

	useEffect(() => {
		if (status === 'idle') dispatch(getAllUsers());
	}, []);

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<SimpleGrid
					columns={{ sm: 1, md: 3 }}
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
							<SimpleGrid columns={{ sm: 3 }} spacing='4'>
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
							</SimpleGrid>
						</CheckboxGroup>
					</FormControl>

					<FormControl>
						<FormLabel htmlFor='users'>users</FormLabel>
						<CheckboxGroup>
							<SimpleGrid columns={{ sm: 2 }} spacing='4'>
								{status === 'succeeded' &&
									members.map((member) => (
										<Controller
											key={member.id}
											control={control}
											name={
												member.id.toString() as UserId
											}
											defaultValue={false}
											render={({
												field: { onChange, value, ref },
											}) => (
												<Checkbox
													onChange={onChange}
													ref={ref}
													isChecked={value}
												>
													{member.alias}
												</Checkbox>
											)}
										/>
									))}
							</SimpleGrid>
						</CheckboxGroup>
					</FormControl>

					<Button onClick={resetFilters} width='full'>
						reset
					</Button>
					<Button type='submit' width='full'>
						search
					</Button>
				</SimpleGrid>
			</form>
		</Box>
	);
};

export default WaifuFilterOptions;
