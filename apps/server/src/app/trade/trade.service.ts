import { Injectable } from '@nestjs/common';
import {
	GetTradesDto,
	GetTradesResponse,
	PostTradeResponse,
	PostTradeService,
	prismaTradeFindManyInput,
	TradeResponse,
} from '@nx-next-nest/types';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TradeService {
	constructor(
		private prisma: PrismaService,
		private storage: StorageService
	) {}

	// post services

	async postTrade(dto: PostTradeService): Promise<PostTradeResponse> {
		const { tradeDto, userId } = dto;

		const trade = await this.prisma.trade.create({
			data: {
				sender: {
					connect: {
						id: userId,
					},
				},
				recipient: {
					connect: {
						id: tradeDto.recipientId,
					},
				},
				wantedWaifus: {
					connect: tradeDto.wantedWaifusIds.map((id) => ({ id })),
				},
				offeredWaifus: {
					connect: tradeDto.offeredWaifusIds.map((id) => ({ id })),
				},
			},
		});

		const {
			id,
			createdAt,
			updatedAt,
			endedAt,
			senderId,
			recipientId,
			status,
		} = trade;

		const sender = await this.prisma.findUniqueUserWithImage(senderId);
		const recipient = await this.prisma.findUniqueUserWithImage(
			recipientId
		);

		const rawWantedWaifus = await this.prisma.waifu.findMany({
			where: {
				id: {
					in: tradeDto.wantedWaifusIds,
				},
			},
			include: {
				media: {
					select: {
						title: true,
						type: true,
					},
				},
				user: {
					select: {
						alias: true,
					},
				},
				image: {
					include: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
			},
		});

		const rawOfferedWaifus = await this.prisma.waifu.findMany({
			where: {
				id: {
					in: tradeDto.offeredWaifusIds,
				},
			},
			include: {
				media: {
					select: {
						title: true,
						type: true,
					},
				},
				user: {
					select: {
						alias: true,
					},
				},
				image: {
					include: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
			},
		});

		const wantedWaifus = rawWantedWaifus.map<
			PostTradeResponse['wantedWaifus'][0]
		>((waifu) => {
			let image: PostTradeResponse['wantedWaifus'][0]['image'];
			if (waifu.image) {
				const imageFileName = this.storage.formatImagePath(
					waifu.id,
					waifu.image.image.format
				);
				image = {
					src: this.storage.getFile(imageFileName, 'waifu'),
				};
			}

			return {
				...waifu,
				image,
			};
		});

		const offeredWaifus = rawOfferedWaifus.map<
			PostTradeResponse['offeredWaifus'][0]
		>((waifu) => {
			let image: PostTradeResponse['offeredWaifus'][0]['image'];
			if (waifu.image) {
				const imageFileName = this.storage.formatImagePath(
					waifu.id,
					waifu.image.image.format
				);
				image = {
					src: this.storage.getFile(imageFileName, 'waifu'),
				};
			}

			return {
				...waifu,
				image,
			};
		});

		const response: PostTradeResponse = {
			id,
			createdAt,
			updatedAt,
			endedAt,
			status,
			senderId,
			recipientId,
			sender,
			recipient,
			wantedWaifus,
			offeredWaifus,
		};

		return response;
	}

	// get services

	async getTrades(dto: GetTradesDto): Promise<GetTradesResponse> {
		const input = prismaTradeFindManyInput(dto);

		// count totalTrades
		const totalTrades = await this.prisma.trade.count({
			where: input.where,
		});
		const rawTrades = await this.prisma.trade.findMany(input);

		const trades = await Promise.all(
			rawTrades.map<Promise<TradeResponse>>(async (trade) => {
				const wantedWaifus = trade.wantedWaifus.map((waifu) =>
					this.prisma.transformPrismaWaifuToWaifuResponse(waifu)
				);
				const offeredWaifus = trade.offeredWaifus.map((waifu) =>
					this.prisma.transformPrismaWaifuToWaifuResponse(waifu)
				);
				return {
					...trade,
					sender: await this.prisma.findUniqueUserWithImage(
						trade.senderId
					),
					recipient: await this.prisma.findUniqueUserWithImage(
						trade.recipientId
					),
					wantedWaifus,
					offeredWaifus,
				};
			})
		);

		return {
			trades,
			totalTrades,
		};
	}

	// patch services

	// delete services
}
