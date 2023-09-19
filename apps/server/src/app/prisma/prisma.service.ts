import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	PrismaUserResponse,
	PrismaWaifuResponse,
	UserResponse,
	WaifuResponse,
	prismaSelectUser,
} from '@nx-next-nest/types';
import { PrismaClient, User } from '@prisma/client';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(
		config: ConfigService,
		private storage: StorageService
	) {
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
			image = {
				src: this.storage.getFirebaseImageString(
					user.uid,
					'user',
					user.image.image.format
				),
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
			image = {
				src: this.storage.getFirebaseImageString(
					waifu.name,
					'waifu',
					waifu.image.image.format
				),
			};
		}

		return {
			...waifu,
			image,
		};
	}
}
