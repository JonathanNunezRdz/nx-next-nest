import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	EditWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
} from '@nx-next-nest/types';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { WaifuService } from './waifu.service';

@Controller('waifu')
export class WaifuController {
	constructor(private waifuService: WaifuService) {}

	@Patch('')
	editWaifu(
		@GetUser('id') userId: number,
		@Body() dto: EditWaifuDto
	): Promise<EditWaifuResponse> {
		return this.waifuService.editWaifu(userId, dto);
	}

	@Get(':id')
	getMediaWaifus(
		@Param('id', ParseIntPipe) mediaId: number,
		@Query() dto: GetMediaWaifusDto
	): Promise<GetMediaWaifusResponse> {
		return this.waifuService.getMediaWaifus(mediaId, dto);
	}

	@Get('')
	getAllWaifus(@Query() dto: GetAllWaifusDto): Promise<GetAllWaifusResponse> {
		return this.waifuService.getAllWaifus(dto);
	}

	@UseGuards(JwtGuard)
	@Post('')
	createWaifu(
		@GetUser('id') userId: number,
		@Body() dto: CreateWaifuDto
	): Promise<CreateWaifuResponse> {
		return this.waifuService.createWaifu(userId, dto);
	}
}
