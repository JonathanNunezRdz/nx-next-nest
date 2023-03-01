import { Prisma, Trade } from '@prisma/client';
import { prismaIncludeTrade } from '.';
import { UserResponse } from '../user';
import { WaifuResponse } from '../waifu';

export type TradeResponse = Trade & {
	sender: UserResponse;
	recipient: UserResponse;
	wantedWaifus: WaifuResponse[];
	offeredWaifus: WaifuResponse[];
};

export type PostTradeResponse = TradeResponse;

export type GetTradesResponse = {
	trades: TradeResponse[];
	totalTrades: number;
};

export type PrismaTradeResponse = Prisma.TradeGetPayload<
	typeof prismaIncludeTrade
>;
