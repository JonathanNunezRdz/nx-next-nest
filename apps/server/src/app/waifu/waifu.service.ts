import { ForbiddenException, Injectable } from '@nestjs/common';
import {
	CreateWaifuDto,
	EditWaifuDto,
	GetAllWaifusDto,
	GetMediaWaifusDto,
} from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { createWaifuImage, upsertWaifuImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WaifuService {
	constructor(private prisma: PrismaService) {}

	async editWaifu(userId: number, dto: EditWaifuDto) {
		const { name, level, waifuId } = dto;
		const upsertWaifuImageOptions = upsertWaifuImage(dto);

		const waifuToEdit = await this.prisma.waifu.findUnique({
			where: {
				id: waifuId,
			},
			select: {
				userId: true,
			},
		});

		if (waifuToEdit.userId !== userId) {
			throw new ForbiddenException('access to resources denied');
		}

		const waifu = await this.prisma.waifu.update({
			where: {
				id: waifuId,
			},
			data: {
				name,
				level,
				image: upsertWaifuImageOptions,
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
				user: {
					select: {
						alias: true,
					},
				},
			},
		});
		return waifu;
	}

	async getMediaWaifus(mediaId: number, dto: GetMediaWaifusDto) {
		const { name, level, users } = dto;
		const waifus = await this.prisma.waifu.findMany({
			where: {
				mediaId,
				name,
				level,
				userId: {
					in: users,
				},
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
				user: {
					select: {
						alias: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return waifus;
	}

	async getAllWaifus(dto: GetAllWaifusDto) {
		const { name, page, limit, level, userId } = dto;
		const totalWaifus = await this.prisma.waifu.count();
		const waifus = await this.prisma.waifu.findMany({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				level: {
					equals: level,
				},
				user: {
					id: {
						equals: userId,
					},
				},
			},
			take: limit,
			skip: (page - 1) * limit,
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
				user: {
					select: {
						alias: true,
					},
				},
			},
		});

		const totalPages =
			waifus.length > 0 ? Math.max(totalWaifus / limit, 1) : 0;

		return { waifus, totalPages };
	}

	async createWaifu(userId: number, dto: CreateWaifuDto) {
		dto.name = dto.name.trim();
		const createWaifuImageOption = createWaifuImage(dto);
		const { name, level, mediaId } = dto;

		const media = await this.prisma.media.findUnique({
			where: {
				id: mediaId,
			},
			select: {
				knownBy: {
					select: {
						userId: true,
					},
				},
			},
		});

		const index = media.knownBy.findIndex((user) => user.userId === userId);

		if (index === -1) {
			throw new ForbiddenException('access to resources denied');
		}

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
					user: {
						select: {
							alias: true,
						},
					},
				},
			});

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
