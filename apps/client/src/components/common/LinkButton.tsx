import {
	IconButton,
	IconButtonProps,
	LinkBox,
	LinkOverlay,
} from '@chakra-ui/react';
import { ParsedUrlQueryInput } from 'querystring';
import NextLink from 'next/link';

interface MyIconButtonProps extends IconButtonProps {
	icon: Required<IconButtonProps>['icon'];
}

interface LinkButtonProps {
	pathname: string;
	query?: string | ParsedUrlQueryInput;
	iconButtonProps: MyIconButtonProps;
}

const LinkButton = ({ pathname, query, iconButtonProps }: LinkButtonProps) => {
	return (
		<LinkBox display='inline-flex'>
			<NextLink
				href={{
					pathname,
					query,
				}}
				passHref
			>
				<LinkOverlay>
					<IconButton
						icon={iconButtonProps['icon']}
						aria-label={iconButtonProps['aria-label']}
						size={iconButtonProps['size']}
						me={iconButtonProps['me']}
						mt={iconButtonProps['mt']}
						colorScheme={iconButtonProps['colorScheme']}
					/>
				</LinkOverlay>
			</NextLink>
		</LinkBox>
	);
};

export default LinkButton;
