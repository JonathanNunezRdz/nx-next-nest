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
import { GetMediaDto } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import FilterUsersInput from '../../components/common/FilterUsersInput';

import { useAppSelector } from '../../store/hooks';
import { selectAllUsers } from '../../store/user';
import { isValidMediaType } from '../../utils';
import { MediaFilterInputs, MediaTypes, UserId } from '../../utils/constants';

interface MediaFilterOptionsProps {
	getMedia: (options: GetMediaDto) => void;
}

const MediaFilterOptions = ({ getMedia }: MediaFilterOptionsProps) => {
	// reducers
	const members = useAppSelector(selectAllUsers);

	// react-hook-form
	const { register, handleSubmit, reset, control } =
		useForm<MediaFilterInputs>({
			defaultValues: {
				anime: false,
				manga: false,
				videogame: false,
				title: '',
				'1': false,
				'2': false,
				'3': false,
				'4': false,
			},
		});
	const onSubmit: SubmitHandler<MediaFilterInputs> = (data) => {
		const users: UserId[] = [];
		const type: MediaType[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (isValidMediaType(key) && value === true) type.push(key);

			if (
				members.findIndex((member) => member.id === Number(key)) > -1 &&
				value === true
			) {
				users.push(key as UserId);
			}
		});

		getMedia({
			page: 1,
			limit: 9,
			title: data.title,
			type,
			users: users.map(Number),
		});
	};

	const resetFilters = () => {
		reset();
		getMedia({ page: 1, limit: 9 });
	};

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<SimpleGrid
					columns={{ sm: 1, md: 3 }}
					spacing='4'
					alignItems='center'
				>
					<FormControl>
						<FormLabel htmlFor='title'>title</FormLabel>
						<Input
							id='title'
							placeholder='filter by title'
							{...register('title')}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='type'>type</FormLabel>
						<CheckboxGroup>
							<SimpleGrid columns={{ sm: 2 }} spacing='4'>
								{MediaTypes.map((label) => (
									<Controller
										key={label}
										control={control}
										name={label as MediaType}
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
								))}
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

export default MediaFilterOptions;
