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
	UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateMediaDto, EditMediaDto, KnowMediaDto } from './dto';
import { GetMediaDto } from './dto/get-media.dto';
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
	getMedias(@Body() dto: GetMediaDto) {
		return this.mediaService.getMedias(dto);
	}

	@Patch('')
	editMedia(@GetUser('id') userId: number, @Body() dto: EditMediaDto) {
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
