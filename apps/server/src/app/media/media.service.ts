import { ForbiddenException, Injectable } from '@nestjs/common';
import {
	CreateMediaDto,
	EditMediaDto,
	GetMediaDto,
	KnowMediaDto,
} from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
	createMediaImage,
	editMediaImage,
	editMediaKnownAt,
} from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
	constructor(private prisma: PrismaService) {}

	async deleteMedia(userId: number, mediaId: number) {
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

		if (media.knownBy.findIndex((users) => users.userId === userId) === -1)
			throw new ForbiddenException('Access to resources denied');

		await this.prisma.media.delete({
			where: {
				id: mediaId,
			},
		});
	}

	async editMedia(userId: number, dto: EditMediaDto) {
		const { title, type, mediaId } = dto;
		const editMediaImageOptions = editMediaImage(dto);
		const editMediaKnownAtOptions = editMediaKnownAt(dto, userId);
		const media = await this.prisma.media.update({
			where: {
				id: mediaId,
			},
			data: {
				title,
				type,
				image: editMediaImageOptions,
				knownBy: editMediaKnownAtOptions,
			},
			include: {
				knownBy: {
					include: {
						user: {
							select: {
								id: true,
								alias: true,
								image: {
									include: {
										image: {
											select: {
												id: true,
												format: true,
											},
										},
									},
								},
							},
						},
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
		return media;
	}

	async knowMedia(userId: number, dto: KnowMediaDto) {
		const media = await this.prisma.media.update({
			where: {
				id: dto.mediaId,
			},
			data: {
				knownBy: {
					create: [
						{
							user: {
								connect: {
									id: userId,
								},
							},
							knownAt: dto.knownAt,
						},
					],
				},
			},
			include: {
				knownBy: {
					include: {
						user: {
							select: {
								id: true,
								alias: true,
							},
						},
					},
				},
				image: {
					include: {
						image: {
							select: {
								id: true,
								format: true,
							},
						},
					},
				},
			},
		});

		return media;
	}

	async getMedias(dto: GetMediaDto) {
		const medias = await this.prisma.media.findMany({
			where: {
				title: {
					contains: dto.title,
					mode: 'insensitive',
				},
				type: {
					equals: dto.type,
				},
				createdAt: {
					lt: dto.cursor,
				},
				knownBy: {
					every: {
						userId: {
							in: dto.users,
						},
					},
				},
			},
			take: dto.limit,
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
				knownBy: {
					include: {
						user: {
							select: {
								id: true,
								alias: true,
								image: {
									include: {
										image: {
											select: {
												id: true,
												format: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		return medias;
	}

	async createMedia(userId: number, dto: CreateMediaDto) {
		dto.title = dto.title.trim();
		const createImage = createMediaImage(dto);

		try {
			const media = await this.prisma.media.create({
				data: {
					title: dto.title,
					type: dto.type,
					image: createImage,
					knownBy: {
						create: [
							{
								user: {
									connect: {
										id: userId,
									},
								},
								knownAt: dto.knownAt,
							},
						],
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
					knownBy: {
						include: {
							user: {
								select: {
									id: true,
									alias: true,
									image: {
										include: {
											image: {
												select: {
													id: true,
													format: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});

			return media;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException(
						`title: '${dto.title}' is already in use`
					);
			}
			throw error;
		}
	}
}
