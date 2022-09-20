import { Injectable } from '@nestjs/common';
import type { EditUserDto } from '@nx-next-nest/types';

import { upsertUserImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async editUser(userId: number, dto: EditUserDto) {
		const { alias, firstName, lastName } = dto;
		const upsertUserImageOptions = upsertUserImage(dto);
		const user = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				alias,
				firstName,
				lastName,
				image: upsertUserImageOptions,
			},
			select: {
				id: true,
				alias: true,
				firstName: true,
				lastName: true,
				email: true,
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
		return user;
	}
}
