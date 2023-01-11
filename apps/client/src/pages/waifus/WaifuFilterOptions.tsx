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
import FilterUsersInput from '../../components/common/FilterUsersInput';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getAllUsers,
	selectAllUsers,
	selectAllUsersStatus,
} from '../../store/user';
import { isValidWaifuLevel } from '../../utils';
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

	// react-hook-form
	const { register, handleSubmit, reset, control } =
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
		const users: UserId[] = [];
		const level: WaifuLevel[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (isValidWaifuLevel(key) && value === true) level.push(key);

			if (
				members.findIndex((member) => member.id === Number(key)) &&
				value === true
			)
				users.push(key as UserId);
		});

		getWaifus({
			page: 1,
			limit: 9,
			name: data.name,
			level,
			users: users.map(Number),
		});
	};
	const resetFilters = () => {
		reset();
		getWaifus({ page: 1, limit: 9 });
	};

	useEffect(() => {
		if (status === 'idle') dispatch(getAllUsers());
	}, [status, dispatch]);

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<SimpleGrid
					columns={{ sm: 1, md: 3 }}
					spacing='4'
					alignItems='center'
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

					<FilterUsersInput control={control} />

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
