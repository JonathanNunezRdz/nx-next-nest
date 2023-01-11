import { User, WaifuLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class GetMediaWaifusDto {
	@IsString()
	@IsOptional()
	name?: string;

	@Transform(({ value }) => value.split(',').map(Number))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	users?: User['id'][];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	level?: WaifuLevel[];
}
