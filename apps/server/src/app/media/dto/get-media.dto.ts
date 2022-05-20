import { MediaType, User } from '@prisma/client';
import {
	ArrayNotEmpty,
	IsArray,
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class GetMediaDto {
	@IsDateString()
	@IsNotEmpty()
	cursor: string;

	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	users?: User['id'][];

	@IsString()
	@IsOptional()
	title?: string;

	@IsEnum(MediaType, {
		message: `type must be a valid option: ${Object.keys(MediaType).join(
			' | '
		)}`,
	})
	@IsOptional()
	type?: MediaType;
}
