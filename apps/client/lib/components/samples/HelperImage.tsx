import type { FC } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';

type HelperImageProps = {
	label?: string;
	src: string;
};

const HelperImage: FC<HelperImageProps> = ({ label = '', src }) => {
	return (
		<Tooltip hasArrow aria-label={label} label={label} placement='auto-end'>
			<Box marginX={2}>
				<Image src={src} alt={label} height={33} width={33} />
			</Box>
		</Tooltip>
	);
};

export default HelperImage;
