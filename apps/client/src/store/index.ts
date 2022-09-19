import create from 'zustand';
import createUserSlice, { UserSlice } from './user';

// interface BearSlice {
// 	bears: number;
// 	addBear: () => void;
// 	eatFish: () => void;
// }

// const createBearSlice: StateCreator<
// 	BearSlice & FishSlice,
// 	[],
// 	[],
// 	BearSlice
// > = (set) => ({
// 	bears: 0,
// 	addBear: () => set((state) => ({ bears: state.bears + 1 })),
// 	eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
// });

// interface FishSlice {
// 	fishes: number;
// 	addFish: () => void;
// }

// const createFishSlice: StateCreator<
// 	BearSlice & FishSlice,
// 	[],
// 	[],
// 	FishSlice
// > = (set) => ({
// 	fishes: 0,
// 	addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
// });

const useBoundStore = create<UserSlice>()((...a) => ({
	...createUserSlice(...a),
}));

export default useBoundStore;
