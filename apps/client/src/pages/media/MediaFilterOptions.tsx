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
import { GetMediaDto } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { Fragment } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { MediaTypeLabels } from '../../utils/constants';

type FilterInputs = Record<MediaType, boolean> & {
	title: string;
};

interface MediaFilterOptionsProps {
	getMedia: (options: GetMediaDto) => void;
}

const MediaFilterOptions = ({ getMedia }: MediaFilterOptionsProps) => {
	const { register, handleSubmit, reset, control } = useForm<FilterInputs>({
		defaultValues: {
			anime: false,
			manga: false,
			videogame: false,
			title: '',
		},
	});
	const onSubmit: SubmitHandler<FilterInputs> = (data) => {
		const type: MediaType[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (value === true) type.push(key as MediaType);
		});

		getMedia({
			page: 1,
			limit: 9,
			title: data.title,
			type,
		});
	};

	const resetFilters = () => {
		reset();
		getMedia({ page: 1, limit: 9 });
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
							<HStack spacing='1rem'>
								{MediaTypeLabels.map((label) => (
									<Controller
										key={label}
										control={control}
										name={label}
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

export default MediaFilterOptions;
