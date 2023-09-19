import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
	GetTradesDto,
	GetTradesResponse,
	PostTradeDto,
	PostTradeResponse,
} from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
	constructor(private tradeService: TradeService) {}

	// get routes

	@Get('')
	getTrades(@Query() dto: GetTradesDto): Promise<GetTradesResponse> {
		return this.tradeService.getTrades(dto);
	}

	// post routes

	@UseGuards(JwtGuard)
	@Post('')
	postTrade(
		@GetUser('id') userId: User['id'],
		@Body() tradeDto: PostTradeDto
	): Promise<PostTradeResponse> {
		return this.tradeService.postTrade({ userId, tradeDto });
	}
}
