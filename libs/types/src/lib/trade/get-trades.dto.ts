import { TradeStatus, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsOptional,
	Max,
	Min,
} from 'class-validator';

export class GetTradesDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	status?: TradeStatus[];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	senders?: User['id'][];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	recipients?: User['id'][];
}
