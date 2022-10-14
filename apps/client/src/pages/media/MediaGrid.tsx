import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { MediaResponse } from '@nx-next-nest/types';
import MediaCard from './MediaCard';

interface MediaGridProps {
	media: MediaResponse[];
	ownId: number;
	isLoggedIn: boolean;
	isFetching: boolean;
}

const MediaGrid = ({
	media,
	isLoggedIn,
	ownId,
	isFetching,
}: MediaGridProps) => {
	if (media.length > 0) {
		return (
			<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing='1rem'>
				{media.map((element) => (
					<MediaCard
						key={element.id}
						media={element}
						ownId={ownId}
						isLoggedIn={isLoggedIn}
						isFetching={isFetching}
					/>
				))}
			</SimpleGrid>
		);
	}
	return (
		<Box>
			<Text>no media has been added to the wia</Text>
		</Box>
	);
};

export default MediaGrid;
