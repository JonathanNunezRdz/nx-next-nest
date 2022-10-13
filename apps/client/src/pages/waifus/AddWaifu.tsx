import { Text } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAddWaifuStatus } from '../../store/waifu';

const AddWaifu = () => {
	const dispatch = useAppDispatch();
	const addWaifuStatus = useAppSelector(selectAddWaifuStatus);
	return <Text>Add waifu</Text>;
};

export default AddWaifu;
