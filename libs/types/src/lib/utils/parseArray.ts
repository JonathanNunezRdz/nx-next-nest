export const parseArray = (arrayString: string) => {
	// [1,2,3,4]
	const removedBrackets = arrayString.replace('[', '').replace(']', '');
	const array = removedBrackets.split(',');
	return array;
};
