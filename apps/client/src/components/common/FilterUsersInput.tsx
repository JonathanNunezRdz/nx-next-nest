import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	SimpleGrid,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getAllUsers,
	selectAllUsers,
	selectAllUsersStatus,
	selectUser,
} from '../../store/user';
import { UserId } from '../../utils/constants';
import Loading from './Loading';

interface FilterUsersInputProps {
	control: Control<any, any>;
}

const FilterUsersInput = ({ control }: FilterUsersInputProps) => {
	// reducers
	const dispatch = useAppDispatch();
	const members = useAppSelector(selectAllUsers);
	const { status, error } = useAppSelector(selectAllUsersStatus);
	const user = useAppSelector(selectUser);

	// effects
	useEffect(() => {
		if (status === 'idle') dispatch(getAllUsers());
	}, [status, dispatch]);

	if (status === 'loading') return <Loading />;

	return (
		<FormControl>
			<FormLabel htmlFor='users'>users</FormLabel>
			<CheckboxGroup>
				<SimpleGrid columns={{ sm: 2 }} spacing='4'>
					{members.map((member) => (
						<Controller
							key={member.id}
							control={control}
							name={member.id.toString() as UserId}
							defaultValue={false}
							render={({ field: { onChange, value, ref } }) => (
								<Checkbox
									onChange={onChange}
									ref={ref}
									isChecked={value}
								>
									{user && user.id === member.id
										? 'me'
										: member.alias}
								</Checkbox>
							)}
						/>
					))}
				</SimpleGrid>
			</CheckboxGroup>
		</FormControl>
	);
};

export default FilterUsersInput;
