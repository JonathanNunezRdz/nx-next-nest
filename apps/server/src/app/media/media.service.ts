import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	CreateMediaResponse,
	CreateMediaService,
	DeleteMediaService,
	EditMediaResponse,
	EditMediaService,
	GetEditMediaResponse,
	GetEditMediaService,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusResponse,
	GetMediaWaifusService,
	KnowMediaResponse,
	KnowMediaService,
	prismaMediaFindManyInput,
} from '@nx-next-nest/types';
import { User } from '@prisma/client';
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

	// get services

	async getMedias(dto: GetMediaDto): Promise<GetMediaResponse> {
		const input = prismaMediaFindManyInput(dto);
		const totalMedias = await this.prisma.media.count({
			where: input.where,
		});
		const rawMedias = await this.prisma.media.findMany(input);

		const medias: GetMediaResponse['medias'] = rawMedias.map((media) => {
			let image: GetMediaResponse['medias'][0]['image'];
			if (media.image) {
				const imagePath = this.storage.formatImagePath(
					media.id,
					media.image.image.format
				);
				image = { src: this.storage.getFile(imagePath, 'media') };
			}

			return {
				...media,
				knownBy: media.knownBy.map((user) => {
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
						},
					};
				}),
				image,
			};
		});

		return { medias, totalMedias };
	}

	async getMediaTitles(userId: User['id']): Promise<GetMediaTitlesResponse> {
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

	async getEditMedia(
		dto: GetEditMediaService
	): Promise<GetEditMediaResponse> {
		const { userId, mediaId } = dto;

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

		if (!media) throw new NotFoundException('media not found');

		const knownAt = media.knownBy.find((user) => user.userId === userId);

		if (typeof knownAt === 'undefined')
			throw new ForbiddenException('access to resources denied');

		let image: GetEditMediaResponse['image'];
		if (media.image) {
			const imagePath = this.storage.formatImagePath(
				media.id,
				media.image.image.format
			);
			image = { src: this.storage.getFile(imagePath, 'media') };
		}

		return {
			id: media.id,
			title: media.title,
			type: media.type,
			knownAt: knownAt.knownAt,
			image,
		};
	}

	async getMediaWaifus(
		dto: GetMediaWaifusService
	): Promise<GetMediaWaifusResponse> {
		const { id, waifuDto } = dto;
		const { name, level, users } = waifuDto;

		const rawMedia = await this.prisma.media.findUnique({
			where: {
				id,
			},
			include: {
				waifus: {
					where: {
						name,
						level: {
							in: level,
						},
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
						user: {
							select: {
								alias: true,
							},
						},
					},
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

		if (!rawMedia) throw new NotFoundException('media not found');

		let image: GetMediaWaifusResponse['media']['image'];

		if (rawMedia.image) {
			const imagePath = this.storage.formatImagePath(
				rawMedia.id,
				rawMedia.image.image.format
			);
			image = { src: this.storage.getFile(imagePath, 'media') };
		}

		const waifus: GetMediaWaifusResponse['media']['waifus'] =
			rawMedia.waifus.map((waifu) => {
				let image: GetMediaWaifusResponse['media']['waifus'][0]['image'];
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

		return {
			media: {
				...rawMedia,
				knownBy: rawMedia.knownBy.map((user) => {
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
						},
					};
				}),
				waifus,
				image,
			},
		};
	}

	// post services

	async createMedia(dto: CreateMediaService): Promise<CreateMediaResponse> {
		const { userId, mediaDto } = dto;
		let { title } = mediaDto;
		const { type, knownAt } = mediaDto;
		title = mediaDto.title.trim();

		const createImage = createMediaImage(mediaDto);

		try {
			const rawMedia = await this.prisma.media.create({
				data: {
					title,
					type,
					image: createImage,
					knownBy: {
						create: [
							{
								user: {
									connect: {
										id: userId,
									},
								},
								knownAt,
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
						orderBy: {
							knownAt: 'asc',
						},
					},
				},
			});

			let image: CreateMediaResponse['image'];

			if (rawMedia.image && dto.imageFile) {
				const imageFileName = this.storage.formatImagePath(
					rawMedia.id,
					rawMedia.image.image.format
				);
				image = {
					src: await this.storage.uploadFile(
						dto.imageFile,
						imageFileName,
						'media'
					),
				};
			}

			const media: CreateMediaResponse = {
				...rawMedia,
				waifus: [],
				knownBy: rawMedia.knownBy.map((user) => {
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
						},
					};
				}),
				image,
			};

			return media;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException(
						`title: '${title}' is already in use`
					);
			}
			throw error;
		}
	}

	// patch services

	async knowMedia(dto: KnowMediaService): Promise<KnowMediaResponse> {
		const { userId, knowDto } = dto;
		const { mediaId, knownAt } = knowDto;

		const rawMedia = await this.prisma.media.update({
			where: {
				id: mediaId,
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
							knownAt,
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

		let image: KnowMediaResponse['image'];

		if (rawMedia.image) {
			const imageFileName = this.storage.formatImagePath(
				rawMedia.id,
				rawMedia.image.image.format
			);
			image = {
				src: this.storage.getFile(imageFileName, 'media'),
			};
		}

		const media: KnowMediaResponse = {
			...rawMedia,
			knownBy: rawMedia.knownBy.map((user) => {
				return {
					...user,
					user: {
						id: user.user.id,
						alias: user.user.alias,
					},
				};
			}),
			image,
		};

		return media;
	}

	async editMedia(dto: EditMediaService): Promise<EditMediaResponse> {
		const { editDto, userId, imageFile } = dto;
		let { title } = editDto;
		const { type, mediaId } = editDto;
		if (title) title = title.trim();

		const editMediaImageOptions = editMediaImage(editDto);
		const editMediaKnownAtOptions = editMediaKnownAt(editDto, userId);

		const oldMedia = await this.prisma.media.findUnique({
			where: {
				id: mediaId,
			},
			select: {
				image: {
					select: {
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

		if (!oldMedia) throw new NotFoundException('media not found');

		const rawMedia = await this.prisma.media.update({
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

		let image: EditMediaResponse['image'];

		if (imageFile && rawMedia.image) {
			// originalMedia did have an image before
			if (oldMedia.image) {
				// delete old image
				const deleteImageFileName = this.storage.formatImagePath(
					rawMedia.id,
					oldMedia.image.image.format
				);
				await this.storage.deleteFile(deleteImageFileName);
			}
			// upload new image
			const imageFileName = this.storage.formatImagePath(
				rawMedia.id,
				rawMedia.image.image.format
			);
			image = {
				src: await this.storage.uploadFile(
					imageFile,
					imageFileName,
					'media'
				),
			};
		}

		const media: EditMediaResponse = {
			...rawMedia,
			knownBy: rawMedia.knownBy.map((user) => {
				return {
					...user,
					user: {
						alias: user.user.alias,
						id: user.user.id,
					},
				};
			}),
			image,
		};
		return media;
	}

	async deleteMedia(dto: DeleteMediaService): Promise<void> {
		const { mediaId, userId } = dto;

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

		if (!media) throw new NotFoundException('media not found');

		if (media.knownBy.findIndex((users) => users.userId === userId) === -1)
			throw new ForbiddenException('access to resources denied');

		const deletedMedia = await this.prisma.media.delete({
			where: {
				id: mediaId,
			},
			select: {
				id: true,
				image: {
					select: {
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

		console.log('deleted media');

		if (deletedMedia.image) {
			await this.prisma.image.delete({
				where: {
					id: deletedMedia.image.image.id,
				},
			});
			console.log('deleted prisma image');

			const deleteImageFileName = this.storage.formatImagePath(
				deletedMedia.id,
				deletedMedia.image.image.format
			);
			await this.storage.deleteFile(deleteImageFileName);
			console.log('deleted media image');
		}
	}
}
