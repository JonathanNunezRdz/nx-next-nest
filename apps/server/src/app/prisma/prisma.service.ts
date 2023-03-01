import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	prismaSelectUser,
	PrismaUserResponse,
	PrismaWaifuResponse,
	UserResponse,
	WaifuResponse,
} from '@nx-next-nest/types';
import { PrismaClient, User } from '@prisma/client';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService, private storage: StorageService) {
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				},
			},
		});
	}

	cleanDb() {
		return this.$transaction([
			this.image.deleteMany(),
			this.waifu.deleteMany(),
			this.media.deleteMany(),
			this.user.deleteMany(),
		]);
	}

	transformPrismaUserToUserResponse(user: PrismaUserResponse): UserResponse {
		let image: UserResponse['image'];

		if (user.image) {
			const imageFilename = this.storage.formatImagePath(
				user.id,
				user.image.image.format
			);
			image = {
				src: this.storage.getFile(imageFilename, 'user'),
			};
		}

		return {
			...user,
			image,
		};
	}

	async findUniqueUserWithImage(userId: User['id']): Promise<UserResponse> {
		const user = await this.user.findUnique({
			where: {
				id: userId,
			},
			...prismaSelectUser,
		});

		if (!user) throw new NotFoundException('user not found');

		return this.transformPrismaUserToUserResponse(user);
	}

	// maybe change transform to StorageService
	transformPrismaWaifuToWaifuResponse(
		waifu: PrismaWaifuResponse
	): WaifuResponse {
		let image: WaifuResponse['image'];

		if (waifu.image) {
			const imageFilename = this.storage.formatImagePath(
				waifu.id,
				waifu.image.image.format
			);
			image = {
				src: this.storage.getFile(imageFilename, 'waifu'),
			};
		}

		return {
			...waifu,
			image,
		};
	}
}
