import { ImageFormat } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
	@IsString()
	@IsOptional()
	alias?: string;

	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}
