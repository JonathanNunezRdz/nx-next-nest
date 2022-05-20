import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class KnowMediaDto {
	@IsInt()
	mediaId: number;

	@IsDateString()
	@IsNotEmpty()
	knownAt: string;
}
