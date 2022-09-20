import { ImageFormat, WaifuLevel } from '@prisma/client';
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateWaifuDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(WaifuLevel, {
		message: `level must be a valid option: ${Object.keys(WaifuLevel).join(
			' | '
		)}`,
	})
	@IsNotEmpty()
	level: WaifuLevel;

	@IsInt()
	mediaId: number;

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}
