import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	CreateWaifuResponse,
	CreateWaifuService,
	EditWaifuResponse,
	EditWaifuService,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetMediaWaifusResponse,
	GetMediaWaifusService,
} from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import {
	createWaifuImage,
	formatImageFileName,
	upsertWaifuImage,
} from '../../utils';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class WaifuService {
	constructor(
		private prisma: PrismaService,
		private storage: StorageService
	) {}

	// get services

	async getAllWaifus(dto: GetAllWaifusDto): Promise<GetAllWaifusResponse> {
		const { name, page, limit, level, users } = dto;
		const totalWaifus = await this.prisma.waifu.count({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				level: {
					in: level,
				},
				user: {
					id: {
						in: users,
					},
				},
			},
		});
		const rawWaifus = await this.prisma.waifu.findMany({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				level: {
					in: level,
				},
				user: {
					id: {
						in: users,
					},
				},
			},
			take: limit,
			skip: (page - 1) * limit,
			orderBy: {
				createdAt: 'desc',
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

		const waifus: GetAllWaifusResponse['waifus'] = rawWaifus.map(
			(waifu) => {
				let image: GetAllWaifusResponse['waifus'][0]['image'];
				if (waifu.image) {
					const imageFileName = formatImageFileName(
						waifu.id,
						waifu.image.image.format
					);
					image = { src: this.storage.getFile(imageFileName) };
				}

				return {
					...waifu,
					image,
				};
			}
		);

		return { waifus, totalWaifus };
	}

	async getMediaWaifus(
		dto: GetMediaWaifusService
	): Promise<GetMediaWaifusResponse> {
		const { title, waifuDto } = dto;
		const { name, level, users } = waifuDto;

		const rawWaifus = await this.prisma.waifu.findMany({
			where: {
				media: {
					title,
				},
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

		const waifus: GetMediaWaifusResponse = rawWaifus.map((waifu) => {
			let image: GetMediaWaifusResponse[0]['image'];
			if (waifu.image) {
				const imageFileName = formatImageFileName(
					waifu.id,
					waifu.image.image.format
				);
				image = { src: this.storage.getFile(imageFileName) };
			}
			return {
				...waifu,
				image,
			};
		});

		return waifus;
	}

	// post services

	async createWaifu(dto: CreateWaifuService): Promise<CreateWaifuResponse> {
		const { waifuDto, userId } = dto;
		let { name, level, mediaId } = waifuDto;
		name = name.trim();

		const createWaifuImageOption = createWaifuImage(waifuDto);

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

		const known =
			media.knownBy.findIndex((user) => user.userId === userId) > -1;

		if (!known) throw new ForbiddenException('access to resources denied');

		try {
			const rawWaifu = await this.prisma.waifu.create({
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

			let image: CreateWaifuResponse['image'];

			if (rawWaifu.image && dto.imageFile) {
				const imageFileName = formatImageFileName(
					rawWaifu.id,
					rawWaifu.image.image.format
				);
				image = {
					src: await this.storage.uploadFile(
						dto.imageFile,
						imageFileName
					),
				};
			}

			const waifu: CreateWaifuResponse = {
				...rawWaifu,
				image,
			};

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

	// patch services

	async editWaifu(dto: EditWaifuService): Promise<EditWaifuResponse> {
		const { userId, waifuDto, imageFile } = dto;
		let { name, level, waifuId } = waifuDto;
		if (name) name = name.trim();

		const upsertWaifuImageOptions = upsertWaifuImage(waifuDto);

		const oldWaifu = await this.prisma.waifu.findUnique({
			where: {
				id: waifuId,
			},
			select: {
				userId: true,
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
		});

		if (!oldWaifu) throw new NotFoundException('waifu not found');

		if (oldWaifu.userId !== userId)
			throw new ForbiddenException('access to resources denied');

		const rawWaifu = await this.prisma.waifu.update({
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

		let image: EditWaifuResponse['image'];

		if (imageFile && rawWaifu.image) {
			// oldWaifu did have an image before
			if (oldWaifu.image) {
				// delete old image
				const deleteImageFileName = formatImageFileName(
					rawWaifu.id,
					oldWaifu.image.image.format
				);
				await this.storage.deleteFile(deleteImageFileName);
			}

			// upload new image
			const imageFileName = formatImageFileName(
				rawWaifu.id,
				rawWaifu.image.image.format
			);
			image = {
				src: await this.storage.uploadFile(imageFile, imageFileName),
			};
		}

		const waifu: EditWaifuResponse = {
			...rawWaifu,
			image,
		};

		return waifu;
	}

	// delete services
}
