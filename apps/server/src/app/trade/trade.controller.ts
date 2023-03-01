import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostTradeDto, PostTradeResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
	constructor(private tradeService: TradeService) {}

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
