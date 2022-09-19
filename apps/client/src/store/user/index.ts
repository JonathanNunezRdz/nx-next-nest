import type { User } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface UserSlice {
	user: User;
	loggedIn: boolean;
	signIn: () => void;
	signOut: () => void;
}

const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
	user: {} as User,
	loggedIn: false,
	signIn: () => set((state) => ({ loggedIn: true })),
	signOut: () => set((state) => ({ loggedIn: false })),
});

export default createUserSlice;
