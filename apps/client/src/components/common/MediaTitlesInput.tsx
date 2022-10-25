import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { GetMediaTitlesResponse } from '@nx-next-nest/types';
import { ChangeEventHandler } from 'react';

interface MediaTitleInputProps {
	onChange: ChangeEventHandler<HTMLSelectElement>;
	mediaId: number;
	isDisabled?: boolean;
	mediaTitles: GetMediaTitlesResponse;
}

const MediaTitleInput = ({
	onChange,
	mediaId,
	mediaTitles,
	isDisabled = false,
}: MediaTitleInputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor='mediaId'>select media</FormLabel>
			<Select
				id='mediaId'
				name='mediaId'
				variant='filled'
				onChange={onChange}
				value={mediaId}
				isDisabled={isDisabled || mediaTitles.length === 0}
			>
				<option value={-1}></option>
				{mediaTitles.length > 0 &&
					mediaTitles.map((media) => (
						<option key={media.id} value={media.id}>
							{media.title}
						</option>
					))}
			</Select>
		</FormControl>
	);
};

export default MediaTitleInput;
