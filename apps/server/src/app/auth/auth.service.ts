import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from '@nx-next-nest/types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hash, verify } from 'argon2';

import { createUserImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	helloWord() {
		return { message: 'Hello World' };
	}

	async signup(dto: SignUpDto) {
		const hashedPassword = await hash(dto.password);
		const createImage = createUserImage(dto);

		try {
			const user = await this.prisma.user.create({
				data: {
					alias: dto.alias,
					firstName: dto.firstName,
					lastName: dto.lastName,
					email: dto.email,
					uid: dto.uid,
					hash: hashedPassword,
					image: createImage,
				},
				include: {
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

			return this.signToken(user.id, user.email);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('credentials already in use');
			}
			throw error;
		}
	}

	async signin(dto: SignInDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) throw new ForbiddenException('incorrect credentials');

		const valid = await verify(user.hash, dto.password);
		if (!valid) throw new ForbiddenException('incorrect credentials');

		return this.signToken(user.id, user.email);
	}

	async signToken(
		userId: number,
		email: string
	): Promise<{ accessToken: string }> {
		const payload = {
			sub: userId,
			email,
		};

		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '30d',
			secret,
		});

		return {
			accessToken: token,
		};
	}
}
