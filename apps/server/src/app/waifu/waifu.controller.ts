import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { WaifuService } from './waifu.service';

@Controller('waifu')
export class WaifuController {
	constructor(private waifuService: WaifuService) {}

	// get routes

	@Get('')
	getAllWaifus(@Query() dto: GetAllWaifusDto): Promise<GetAllWaifusResponse> {
		return this.waifuService.getAllWaifus(dto);
	}

	@Get(':title')
	getMediaWaifus(
		@Param('title') title: string,
		@Query() waifuDto: GetMediaWaifusDto
	): Promise<GetMediaWaifusResponse> {
		return this.waifuService.getMediaWaifus({ title, waifuDto });
	}

	// post routes

	@UseGuards(JwtGuard)
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	createWaifu(
		@GetUser('id') userId: User['id'],
		@Body() waifuDto: CreateWaifuDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<CreateWaifuResponse> {
		return this.waifuService.createWaifu({ userId, waifuDto, imageFile });
	}

	// patch routes

	@UseGuards(JwtGuard)
	@Patch('')
	@UseInterceptors(FileInterceptor('file'))
	editWaifu(
		@GetUser('id') userId: User['id'],
		@Body() waifuDto: EditWaifuDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<EditWaifuResponse> {
		return this.waifuService.editWaifu({ userId, waifuDto, imageFile });
	}

	// delete routes
}
