import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		if (data) return request.user[data];
		return request.user;
	}
);
