import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
	return (
		<Flex as='footer' width='full' align='center' justifyContent='center'>
			<Text>{new Date().toDateString()}</Text>
		</Flex>
	);
};

export default Footer;
