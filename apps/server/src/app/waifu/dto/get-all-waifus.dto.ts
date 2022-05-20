import { WaifuLevel } from '@prisma/client';
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class GetAllWaifusDto {
	@IsDateString()
	@IsNotEmpty()
	cursor: string;

	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

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
