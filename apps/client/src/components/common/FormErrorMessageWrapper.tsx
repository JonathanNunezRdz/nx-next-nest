import { Box, Text } from '@chakra-ui/react';
import { CommonError } from '@nx-next-nest/types';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ReactNode } from 'react';
import { isHttpError, isFetchBaseQueryError } from '../../utils';

interface FormErrorMessageProps {
	error: CommonError | SerializedError | FetchBaseQueryError;
}

const FormErrorMessageWrapper = ({ error }: FormErrorMessageProps) => {
	let content: ReactNode = JSON.stringify(error);

	if (isFetchBaseQueryError(error)) {
		const { data } = error;
		if (isHttpError(data)) {
			if (typeof data.message === 'object') {
				content = data.message.map((message) => (
					<Text key={message}>{message}</Text>
				));
			} else {
				content = <Text>{data.message}</Text>;
			}
		}
	}

	console.log('form error', error);

	return <Box color='red.300'>{content}</Box>;
};

export default FormErrorMessageWrapper;
