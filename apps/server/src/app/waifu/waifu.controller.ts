import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateWaifuDto } from './dto';
import { GetAllWaifusDto } from './dto/get-all-waifus.dto';
import { WaifuService } from './waifu.service';

@UseGuards(JwtGuard)
@Controller('waifu')
export class WaifuController {
	constructor(private waifuService: WaifuService) {}

	@Get('')
	getAllWaifus(@Query() dto: GetAllWaifusDto) {
		return this.waifuService.getAllWaifus(dto);
	}

	@Post('')
	createWaifu(@GetUser('id') userId: number, @Body() dto: CreateWaifuDto) {
		return this.waifuService.createWaifu(userId, dto);
	}
}
