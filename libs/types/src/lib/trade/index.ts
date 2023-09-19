import { Prisma } from '@prisma/client';
import { RequestStatus } from '../common';
import { prismaSelectWaifu } from '../waifu';
import { GetTradesDto } from './get-trades.dto';
import { TradeResponse } from './trade.response';

export * from './get-trades.dto';
export * from './post-trade.dto';
export * from './trade.response';

export interface TradeState {
	get: {
		data: TradeResponse[];
		totalTrades: number;
		appliedFilters: GetTradesDto;
	} & RequestStatus;
	post: RequestStatus;
}

export const prismaIncludeTrade = Prisma.validator<Prisma.TradeArgs>()({
	include: {
		wantedWaifus: prismaSelectWaifu,
		offeredWaifus: prismaSelectWaifu,
	},
});

export const prismaTradeFindManyInput = (dto: GetTradesDto) =>
	Prisma.validator<Prisma.TradeFindManyArgs>()({
		where: {
			status: {
				in: dto.status,
			},
			AND: [
				{
					senderId: {
						in: dto.senders,
					},
				},
				{
					recipientId: {
						in: dto.recipients,
					},
				},
			],
		},
		take: dto.limit,
		skip: (dto.page - 1) * dto.limit,
		orderBy: {
			createdAt: 'desc',
		},
		include: prismaIncludeTrade.include,
	});
