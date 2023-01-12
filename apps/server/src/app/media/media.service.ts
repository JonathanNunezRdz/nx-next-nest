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
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
	constructor(
		private prisma: PrismaService,
		private storage: StorageService
	) {}

	async postImage(
		file: Express.Multer.File,
		filename: string,
		format: string
	) {
		return this.storage.uploadFile(file, filename, format);
	}

	async getImageURL(filename: string) {
		return this.storage.getFile(filename);
	}

	async getMediaTitles(userId: number) {
		const mediaTitles = await this.prisma.media.findMany({
			where: {
				knownBy: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
				title: true,
			},
		});
		return mediaTitles;
	}

	async getEditMedia(userId: number, mediaId: number) {
		const media = await this.prisma.media.findFirst({
			where: {
				id: mediaId,
				knownBy: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
				title: true,
				type: true,
				knownBy: {
					select: {
						knownAt: true,
						userId: true,
					},
				},
			},
		});

		const knownAt = media.knownBy.find((user) => user.userId === userId);

		if (typeof knownAt === 'undefined')
			throw new ForbiddenException('access to resources denied');

		return {
			mediaId: media.id,
			title: media.title,
			type: media.type,
			knownAt: knownAt.knownAt.toISOString(),
		};
	}

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
			throw new ForbiddenException('access to resources denied');

		const deletedMedia = await this.prisma.media.delete({
			where: {
				id: mediaId,
			},
			select: {
				image: {
					select: {
						image: {
							select: {
								id: true,
							},
						},
					},
				},
			},
		});
		await this.prisma.image.delete({
			where: {
				id: deletedMedia.image.image.id,
			},
		});
		console.log('deleted media');
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
				waifus: {
					select: {
						id: true,
						name: true,
					},
					take: 3,
					orderBy: {
						createdAt: 'desc',
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
					orderBy: {
						knownAt: 'asc',
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
				waifus: {
					select: {
						id: true,
						name: true,
					},
					take: 3,
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
					orderBy: {
						knownAt: 'asc',
					},
				},
			},
		});

		return media;
	}

	async getMedias(dto: GetMediaDto) {
		const totalMedias = await this.prisma.media.count({
			where: {
				title: {
					contains: dto.title,
					mode: 'insensitive',
				},
				type: {
					in: dto.type,
				},
				knownBy: {
					every: {
						user: {
							id: {
								in: dto.users,
							},
						},
					},
				},
			},
		});
		const medias = await this.prisma.media.findMany({
			where: {
				title: {
					contains: dto.title,
					mode: 'insensitive',
				},
				type: {
					in: dto.type,
				},
				knownBy: {
					every: {
						user: {
							id: {
								in: dto.users,
							},
						},
					},
				},
			},
			take: dto.limit,
			orderBy: {
				createdAt: 'desc',
			},
			skip: (dto.page - 1) * dto.limit,
			include: {
				waifus: {
					select: {
						id: true,
						name: true,
					},
					take: 3,
					orderBy: {
						createdAt: 'desc',
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
					orderBy: {
						knownAt: 'asc',
					},
				},
			},
		});

		const mediasWithImageUrl = medias.map((media) => {
			const imagePath = `${media.title}.${media.image.image.format}`;
			const signedImageUrl = this.storage.getFile(imagePath);
			return {
				...media,
				image: {
					...media.image,
					image: {
						...media.image.image,
						src: signedImageUrl,
					},
				},
			};
		});

		return { medias: mediasWithImageUrl, totalMedias };
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
					waifus: {
						select: {
							id: true,
							name: true,
						},
						take: 3,
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
						orderBy: {
							knownAt: 'asc',
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
