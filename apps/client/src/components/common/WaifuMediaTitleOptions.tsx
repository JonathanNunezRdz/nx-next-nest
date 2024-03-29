import { useAppSelector } from '@client/src/store/hooks';
import { selectMediaTitles } from '@client/src/store/media';

function WaifuMediaTitleOptions() {
	const mediaTitles = useAppSelector(selectMediaTitles);
	return (
		<>
			{mediaTitles.map((media) => (
				<option key={media.id} value={media.id}>
					{media.title}
				</option>
			))}
		</>
	);
}

export default WaifuMediaTitleOptions;
