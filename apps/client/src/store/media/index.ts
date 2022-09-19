import type { Media } from '@prisma/client';
import { StateCreator } from 'zustand';
import { getMedia } from './actions';

export interface MediaSlice {
	media: Media[];
	getMedia: () => Promise<void>;
}
// TODO: create mediaSlice
const createMediaSlice: StateCreator<MediaSlice, [], [], MediaSlice> = (
	set
) => ({
	media: [],
	getMedia: async () => {
		try {
			await getMedia();
		} catch (error) {
			log;
		}
	},
	// loggedIn: false,
	// signIn: async (email, password) => {
	// 	try {
	// 		await signIn(email, password);
	// 		set(() => ({ loggedIn: true }));
	// 	} catch (error) {
	// 		if (isAxiosError<SignInError>(error)) {
	// 			console.log(error.response.data.message);
	// 		} else {
	// 			console.error(error);
	// 		}
	// 	}
	// },
	// signOut: () => set(() => ({ loggedIn: false })),
});

export default createMediaSlice;
