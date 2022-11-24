import {
	Body,
	Controller,
	Get,
	Param,
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

	@UseGuards(JwtGuard)
	@Patch('')
	editWaifu(
		@GetUser('id') userId: number,
		@Body() dto: EditWaifuDto
	): Promise<EditWaifuResponse> {
		return this.waifuService.editWaifu(userId, dto);
	}

	@Get(':title')
	getMediaWaifus(
		@Param('title') title: string,
		@Query() dto: GetMediaWaifusDto
	): Promise<GetMediaWaifusResponse> {
		return this.waifuService.getMediaWaifus(title, dto);
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
