import { StatHelpText } from '@chakra-ui/react';
import { MediaKnownUser } from '@nx-next-nest/types';

interface KnownByProps {
	users: MediaKnownUser[];
	ownId: number;
}

const KnownBy = ({ users, ownId }: KnownByProps) => {
	return (
		<>
			{users.map(({ user, knownAt }, i) => (
				<StatHelpText key={user.id} mb={1 !== users.length ? '0' : '2'}>
					{ownId === user.id ? 'me' : user.alias} -{' '}
					{new Date(knownAt).toDateString()}
				</StatHelpText>
			))}
		</>
	);
};

export default KnownBy;
