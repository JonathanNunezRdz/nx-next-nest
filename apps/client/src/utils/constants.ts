import { useColorModeValue } from '@chakra-ui/react';
import { MediaLabel } from '@nx-next-nest/types';
import { MediaType, WaifuLevel } from '@prisma/client';

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
	nationalTreasure: 'national treasure',
	freeAgent: 'free agent',
	genin: 'genin',
	chunin: 'chunin',
	jonin: 'jonin',
	topWaifu: 'top waifu',
};

export const MediaTypeLabels: MediaType[] = ['anime', 'manga', 'videogame'];

export const useCardColor = () => useColorModeValue('teal.100', 'teal.500');
