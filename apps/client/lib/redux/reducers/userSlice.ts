import type { User } from '@prisma/client';

export type UserState = {
	age: number;
} & User;
