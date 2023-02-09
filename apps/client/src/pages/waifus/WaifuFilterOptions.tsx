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
import FilterUsersInput from '@client/src/components/common/FilterUsersInput';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectAllUsers, selectAllUsersStatus } from '@client/src/store/user';
import { getAllUsersAction } from '@client/src/store/user/actions';
import { isValidWaifuLevel } from '@client/src/utils';
import {
	WaifuFilterInputs,
	WaifuLevelLabels,
} from '@client/src/utils/constants';
import { GetAllWaifusDto } from '@nx-next-nest/types';
import { WaifuLevel } from '@prisma/client';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface WaifuFilterOptionsProps {
	getWaifus: (options: GetAllWaifusDto) => void;
}

const WaifuFilterOptions = ({ getWaifus }: WaifuFilterOptionsProps) => {
	// reducers
	const dispatch = useAppDispatch();
	const members = useAppSelector(selectAllUsers);
	const { status } = useAppSelector(selectAllUsersStatus);

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
			},
		});
	const onSubmit: SubmitHandler<WaifuFilterInputs> = (data) => {
		const users: string[] = [];
		const level: WaifuLevel[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (isValidWaifuLevel(key) && value === true) level.push(key);

			if (
				members.findIndex((member) => member.id === key) &&
				value === true
			)
				users.push(key);
		});

		getWaifus({
			page: 1,
			limit: 9,
			name: data.name,
			level,
			users,
		});
	};
	const resetFilters = () => {
		reset();
		getWaifus({ page: 1, limit: 9 });
	};

	useEffect(() => {
		if (status === 'idle') dispatch(getAllUsersAction());
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
