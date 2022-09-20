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
	EditMediaDto,
	GetMediaDto,
	GetMediaResponse,
	KnowMediaDto,
} from '@nx-next-nest/types';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MediaService } from './media.service';

@UseGuards(JwtGuard)
@Controller('media')
export class MediaController {
	constructor(private mediaService: MediaService) {}

	@Patch('know')
	knowMedia(@GetUser('id') userId: number, @Body() dto: KnowMediaDto) {
		return this.mediaService.knowMedia(userId, dto);
	}

	@Post('create')
	createMedia(@GetUser('id') userId: number, @Body() dto: CreateMediaDto) {
		return this.mediaService.createMedia(userId, dto);
	}

	@Get('')
	getMedias(@Query() dto: GetMediaDto): Promise<GetMediaResponse[]> {
		console.log({ dto });

		return this.mediaService.getMedias(dto);
	}

	@Patch('')
	editMedia(
		@GetUser('id') userId: number,
		@Body() dto: EditMediaDto
	): Promise<GetMediaResponse> {
		return this.mediaService.editMedia(userId, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteMedia(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) mediaId: number
	) {
		return '';
	}
}
