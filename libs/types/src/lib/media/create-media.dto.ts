import { ImageFormat, MediaType } from '@prisma/client';
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateMediaDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsEnum(MediaType, {
		message: `type must be a valid option: ${Object.keys(MediaType).join(
			' | '
		)}`,
	})
	@IsNotEmpty()
	type: MediaType;

	@IsDateString()
	@IsNotEmpty()
	knownAt: string;

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}
