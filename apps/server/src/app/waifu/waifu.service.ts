import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWaifuDto, GetAllWaifusDto } from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { createWaifuImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WaifuService {
	constructor(private prisma: PrismaService) {}

	async getMediaWaifus() {}

	async getAllWaifus(dto: GetAllWaifusDto) {
		const { name, cursor, limit, level, userId } = dto;
		const waifus = await this.prisma.waifu.findMany({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				level: {
					equals: level,
				},
				createdAt: {
					lt: cursor,
				},
				user: {
					id: {
						equals: userId,
					},
				},
			},
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				image: {
					include: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
				media: {
					select: {
						title: true,
						type: true,
					},
				},
			},
		});

		return waifus;
	}

	async createWaifu(userId: number, dto: CreateWaifuDto) {
		dto.name = dto.name.trim();
		const createWaifuImageOption = createWaifuImage(dto);
		const { name, level, mediaId } = dto;

		console.log('create waifu');

		try {
			const waifu = await this.prisma.waifu.create({
				data: {
					name,
					level,
					since: new Date().toISOString(),
					image: createWaifuImageOption,
					media: {
						connect: {
							id: mediaId,
						},
					},
					user: {
						connect: {
							id: userId,
						},
					},
				},
				include: {
					image: {
						select: {
							image: {
								select: {
									format: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							alias: true,
							image: {
								select: {
									image: {
										select: {
											format: true,
										},
									},
								},
							},
						},
					},
					media: {
						select: {
							id: true,
							title: true,
							type: true,
						},
					},
				},
			});

			console.log('created waifu');

			return waifu;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException(
						`name: ${name} is already in this media`
					);
			}
			throw error;
		}
	}
}
