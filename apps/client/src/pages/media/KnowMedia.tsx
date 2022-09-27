import { CheckIcon } from '@chakra-ui/icons';
import {
	Box,
	Popover,
	PopoverTrigger,
	IconButton,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	PopoverHeader,
	PopoverBody,
	Input,
	FormControl,
	FormLabel,
	Flex,
	useDisclosure,
} from '@chakra-ui/react';
import { KnowMediaDto } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { knowMedia } from '../../store/media';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';

interface KnowMediaProps {
	mediaId: number;
	mediaType: MediaType;
}

// TODO: change popover to a new page -> /media/know

const KnowMedia = ({ mediaId, mediaType }: KnowMediaProps) => {
	const dispatch = useAppDispatch();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const formik = useFormik<KnowMediaDto>({
		initialValues: {
			mediaId,
			knownAt: formatDate(),
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				knownAt: prepareDate(values.knownAt),
			};
			const res = await dispatch(knowMedia(newValues));
			if (res.meta.requestStatus === 'fulfilled') onClose();
		},
	});
	return (
		<Box>
			<Popover isOpen={isOpen} onClose={onClose}>
				<PopoverTrigger>
					<IconButton
						aria-label='finished it'
						icon={<CheckIcon />}
						size='xs'
						colorScheme='green'
						onClick={onOpen}
					/>
				</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow />
					<PopoverCloseButton />
					<PopoverHeader fontSize='md'>
						mark as {mediaLabel.past[mediaType]}?
					</PopoverHeader>
					<PopoverBody>
						<form onSubmit={formik.handleSubmit}>
							<Flex w='full' p='0.5rem'>
								<FormControl>
									<FormLabel htmlFor='knownAt' hidden>
										date
									</FormLabel>
									<Input
										id='knownAt'
										name='knownAt'
										type='date'
										variant='filled'
										onChange={formik.handleChange}
										value={formik.values.knownAt}
										borderRightRadius='0'
										max={formatDate()}
									/>
								</FormControl>
								<Box>
									<IconButton
										type='submit'
										aria-label='done'
										icon={<CheckIcon />}
										colorScheme='green'
										borderLeftRadius='0'
										borderRightRadius='md'
									/>
								</Box>
							</Flex>
						</form>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Box>
	);
};

export default KnowMedia;
