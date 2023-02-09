import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	SimpleGrid,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	selectAllUsers,
	selectAllUsersStatus,
	selectUser,
} from '@client/src/store/user';
import { getAllUsersAction } from '@client/src/store/user/actions';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';

import Loading from './Loading';

// TODO: important -> change UserId (from constants) to work with uuids

interface FilterUsersInputProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>;
}

const FilterUsersInput = ({ control }: FilterUsersInputProps) => {
	// reducers
	const dispatch = useAppDispatch();
	const members = useAppSelector(selectAllUsers);
	const { status } = useAppSelector(selectAllUsersStatus);
	const user = useAppSelector(selectUser);

	// effects
	useEffect(() => {
		if (status === 'idle') dispatch(getAllUsersAction());
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
							name={member.id}
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
