import { MediaType, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class GetMediaDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

	@Transform(({ value }) => JSON.parse(value))
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
