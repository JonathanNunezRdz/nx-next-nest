import {
	Box,
	Grid,
	Heading,
	Text,
	useBreakpointValue,
	useColorMode,
} from '@chakra-ui/react';

const SomeText = () => {
	const { colorMode } = useColorMode();
	const boxFontSize = useBreakpointValue({
		base: 'xs',
		sm: 'sm',
	});
	const headerFontSize = useBreakpointValue({
		base: 'lg',
		sm: '3xl',
	});

	return (
		<Grid gap={2}>
			<Heading as='h2' fontSize={headerFontSize}>
				Hello
			</Heading>

			<Box
				backgroundColor={
					colorMode === 'light' ? 'gray.200' : 'gray.500'
				}
				padding={4}
				borderRadius={4}
			>
				<Box fontSize={boxFontSize}>
					<Text>
						This is a Next.js app with Chakra-UI and TypeScript
						setup.
					</Text>
					<Text>
						This is a Next.js app with Chakra-UI and TypeScript
						setup.
					</Text>
				</Box>
			</Box>
		</Grid>
	);
};

export default SomeText;
