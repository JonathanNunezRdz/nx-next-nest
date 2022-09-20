import api from '../api';

export const getMedia = async (cursor: string, limit: number) => {
	const res = await api.get('/media', {
		params: {
			cursor,
			limit,
		},
	});
	console.log({ res });
};
