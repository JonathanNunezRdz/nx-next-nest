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
	UseGuards,
} from '@nestjs/common';
import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	GetMediaDto,
	GetMediaResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@nx-next-nest/types';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
	constructor(private mediaService: MediaService) {}

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
	createMedia(
		@GetUser('id') userId: number,
		@Body() dto: CreateMediaDto
	): Promise<CreateMediaResponse> {
		return this.mediaService.createMedia(userId, dto);
	}

	// TODO: do not use jwt guard
	@Get('')
	getMedias(@Query() dto: GetMediaDto): Promise<GetMediaResponse> {
		console.log({ dto });

		return this.mediaService.getMedias(dto);
	}

	@UseGuards(JwtGuard)
	@Patch('')
	editMedia(@GetUser('id') userId: number, @Body() dto: EditMediaDto) {
		return this.mediaService.editMedia(userId, dto);
	}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteMedia(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) mediaId: number
	) {
		return '';
	}
}
