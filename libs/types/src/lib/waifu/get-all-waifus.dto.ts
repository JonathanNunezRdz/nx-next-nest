import { WaifuLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetAllWaifusDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@IsOptional()
	userId?: number;

	@IsString()
	@IsOptional()
	name?: string;

	@IsEnum(WaifuLevel, {
		message: `level must be a valid option: ${Object.keys(WaifuLevel).join(
			' | '
		)}`,
	})
	@IsOptional()
	level?: WaifuLevel;
}
