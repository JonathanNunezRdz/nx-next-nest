import { MediaLabel } from '@nx-next-nest/types';
import { WaifuLevel } from '@prisma/client';

export const mediaLabel: MediaLabel = {
	present: {
		anime: 'watch',
		manga: 'read',
		videogame: 'play',
	},
	past: {
		anime: 'watched',
		manga: 'read',
		videogame: 'played',
	},
};

export const WaifuLevelLabels: Record<WaifuLevel, string> = {
	freeAgent: 'free agent',
	genin: 'genin',
	chunin: 'chunin',
	jonin: 'jonin',
	topWaifu: 'top waifu',
};
