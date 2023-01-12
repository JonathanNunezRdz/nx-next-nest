import { IsNotEmpty, IsString } from 'class-validator';

export class PostImageDto {
	@IsString()
	@IsNotEmpty()
	filename: string;

	@IsString()
	@IsNotEmpty()
	format: string;
}
