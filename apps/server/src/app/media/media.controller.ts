import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	EditMediaResponse,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	KnowMediaDto,
	KnowMediaResponse,
	PostImageDto,
} from '@nx-next-nest/types';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
	constructor(private mediaService: MediaService) {}

	@Post('test_image')
	@UseInterceptors(FileInterceptor('file'))
	postImage(
		@Body() dto: PostImageDto,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.mediaService.postImage(file, dto.filename, dto.format);
	}

	@Get('test_image/:image_url')
	getImageURL(@Param('image_url') imageURL: string) {
		return this.mediaService.getImageURL(imageURL);
	}

	@UseGuards(JwtGuard)
	@Get('titles')
	getMediaTitles(
		@GetUser('id') userId: number
	): Promise<GetMediaTitlesResponse> {
		return this.mediaService.getMediaTitles(userId);
	}

	@UseGuards(JwtGuard)
	@Get('edit/:id')
	getEditMedia(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) mediaId: number
	): Promise<GetEditMediaResponse> {
		return this.mediaService.getEditMedia(userId, mediaId);
	}

	@UseGuards(JwtGuard)
	@Patch('know')
	knowMedia(
		@GetUser('id') userId: number,
		@Body() dto: KnowMediaDto
	): Promise<KnowMediaResponse> {
		return this.mediaService.knowMedia(userId, dto);
	}

	@UseGuards(JwtGuard)
	@Post('create')
	@UseInterceptors(FileInterceptor('file'))
	createMedia(
		@GetUser('id') userId: number,
		@Body() mediaDto: CreateMediaDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<CreateMediaResponse> {
		return this.mediaService.createMedia({ mediaDto, userId, imageFile });
	}

	@Get('')
	getMedias(@Query() dto: GetMediaDto): Promise<GetMediaResponse> {
		return this.mediaService.getMedias(dto);
	}

	@UseGuards(JwtGuard)
	@Patch('')
	editMedia(
		@GetUser('id') userId: number,
		@Body() dto: EditMediaDto
	): Promise<EditMediaResponse> {
		return this.mediaService.editMedia(userId, dto);
	}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteMedia(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) mediaId: number
	) {
		return this.mediaService.deleteMedia(userId, mediaId);
	}
}
