import { Trade, User, Waifu } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class PostTradeDto {
	@IsString()
	recipientId: Trade['recipientId'];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	wantedWaifusIds: Waifu['id'][];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	offeredWaifusIds: Waifu['id'][];
}

export interface PostTradeService {
	userId: User['id'];
	tradeDto: PostTradeDto;
}

export interface PostTradeThunk {
	tradeDto: PostTradeDto;
}
