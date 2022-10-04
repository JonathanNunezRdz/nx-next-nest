import { User, WaifuLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator';

export class GetMediaWaifusDto {
	@IsString()
	@IsOptional()
	name?: string;

	@Transform(({ value }) => JSON.parse(value))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	users?: User['id'][];

	@IsEnum(WaifuLevel, {
		message: `level must be a valid option: ${Object.keys(WaifuLevel).join(
			' | '
		)}`,
	})
	@IsOptional()
	level?: WaifuLevel;
}
