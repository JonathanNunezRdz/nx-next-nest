import {
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Request } from 'express';

export const GetUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		if (!request.user) {
			throw new ForbiddenException('User not authenticated')
		}

		if (data) return (request.user as User)[data];
		return request.user as User;
	}
);
