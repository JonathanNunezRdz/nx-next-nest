import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	CreateWaifuResponse,
	CreateWaifuService,
	DeleteWaifuDto,
	EditWaifuResponse,
	EditWaifuService,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetEditWaifuResponse,
	GetEditWaifuService,
	prismaSelectWaifu,
	prismaWaifuFindManyInput,
	WaifuResponse,
} from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { createWaifuImage, upsertWaifuImage } from '@server/src/utils';

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
		const input = prismaWaifuFindManyInput(dto);
		const totalWaifus = await this.prisma.waifu.count({
			where: input.where,
		});
		const rawWaifus = await this.prisma.waifu.findMany(input);

		const waifus = rawWaifus.map<WaifuResponse>(
			this.prisma.transformPrismaWaifuToWaifuResponse
		);

		return { waifus, totalWaifus };
	}

	async getEditWaifu(
		dto: GetEditWaifuService
	): Promise<GetEditWaifuResponse> {
		const { userId, waifuId } = dto;

		const rawWaifu = await this.prisma.waifu.findFirst({
			where: {
				id: waifuId,
				userId,
			},
			select: {
				id: true,
				name: true,
				level: true,
				mediaId: true,
				userId: true,
				since: true,
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

		if (!rawWaifu) throw new NotFoundException('waifu not found');

		let image: GetEditWaifuResponse['image'];

		if (rawWaifu.image) {
			const imagePath = this.storage.formatImagePath(
				rawWaifu.id,
				rawWaifu.image.image.format
			);
			image = { src: this.storage.getFile(imagePath, 'waifu') };
		}

		return {
			id: rawWaifu.id,
			name: rawWaifu.name,
			level: rawWaifu.level,
			mediaId: rawWaifu.mediaId,
			userId: rawWaifu.userId,
			since: rawWaifu.since,
			image,
		};
	}

	// post services

	async createWaifu(dto: CreateWaifuService): Promise<CreateWaifuResponse> {
		const { waifuDto, userId } = dto;
		let { name } = waifuDto;
		const { level, mediaId } = waifuDto;
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
				select: prismaSelectWaifu.select,
			});

			const waifu =
				this.prisma.transformPrismaWaifuToWaifuResponse(rawWaifu);

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
		let { name } = waifuDto;
		const { level, waifuId } = waifuDto;
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
			select: prismaSelectWaifu.select,
		});

		let image: EditWaifuResponse['image'];

		if (imageFile && rawWaifu.image) {
			// oldWaifu did have an image before
			if (oldWaifu.image) {
				// delete old image
				const deleteImageFileName = this.storage.formatImagePath(
					rawWaifu.id,
					oldWaifu.image.image.format
				);
				await this.storage.deleteFile(deleteImageFileName);
			}

			// upload new image
			const imageFileName = this.storage.formatImagePath(
				rawWaifu.id,
				rawWaifu.image.image.format
			);
			image = {
				src: await this.storage.uploadFile(
					imageFile,
					imageFileName,
					'waifu'
				),
			};
		}

		return { ...rawWaifu, image };
	}

	// delete services

	async deleteWaifu(dto: DeleteWaifuDto): Promise<void> {
		const { waifuId, userId } = dto;

		const waifu = await this.prisma.waifu.findUnique({
			where: {
				id: waifuId,
			},
			select: {
				userId: true,
			},
		});

		if (!waifu) throw new NotFoundException('waifu not found');

		if (waifu.userId !== userId)
			throw new ForbiddenException('access to resources denied');

		const deletedWaifu = await this.prisma.waifu.delete({
			where: {
				id: waifuId,
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

		console.log('deleted waifu');

		if (deletedWaifu.image) {
			await this.prisma.image.delete({
				where: {
					id: deletedWaifu.image.image.id,
				},
			});

			console.log('deleted prisma image');

			const deleteImageFileName = this.storage.formatImagePath(
				deletedWaifu.id,
				deletedWaifu.image.image.format
			);
			await this.storage.deleteFile(deleteImageFileName);
			console.log('deleted waifu image');
		}
	}
}
