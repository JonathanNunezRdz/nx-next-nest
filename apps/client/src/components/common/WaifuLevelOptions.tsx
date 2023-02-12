import { WaifuLevelLabels } from '@client/src/utils/constants';

const WaifuLevelOptions = () => {
	return (
		<>
			{Object.entries(WaifuLevelLabels).map(([value, label]) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</>
	);
};

export default WaifuLevelOptions;
